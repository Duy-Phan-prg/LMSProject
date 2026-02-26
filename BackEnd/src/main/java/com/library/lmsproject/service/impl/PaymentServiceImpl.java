package com.library.lmsproject.service.impl;

import com.library.lmsproject.config.VNPayConfig;
import com.library.lmsproject.dto.request.CreatePaymentRequest;
import com.library.lmsproject.entity.Borrowings;
import com.library.lmsproject.entity.Payment;
import com.library.lmsproject.entity.PaymentStatus;
import com.library.lmsproject.enums.PaymentStatus;
import com.library.lmsproject.repository.BorrowingRepository;
import com.library.lmsproject.repository.BorrowingsRepository;
import com.library.lmsproject.repository.PaymentRepository;
import com.library.lmsproject.service.PaymentService;
import com.library.lmsproject.utils.VNPayUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final BorrowingRepository borrowingRepository;
    private final PaymentRepository paymentRepository;
    private final VNPayConfig vnpayConfig;

    // =====================================
    // CREATE PAYMENT
    // =====================================
    @Override
    @Transactional
    public String createPayment(CreatePaymentRequest request) throws Exception {

        Borrowings borrowing = borrowingRepository.findById(request.getBorrowingId())
                .orElseThrow(() -> new RuntimeException("Borrowing not found"));

        if (borrowing.getFineAmount() == null || borrowing.getFineAmount() <= 0) {
            throw new RuntimeException("No fine to pay");
        }

        // ❗ tránh pay 2 lần
        if (paymentRepository.existsByBorrowingAndStatus(borrowing, PaymentStatus.SUCCESS)) {
            throw new RuntimeException("Fine already paid");
        }

        String txnRef = String.valueOf(System.currentTimeMillis());

        Payment payment = Payment.builder()
                .borrowing(borrowing)
                .amount(borrowing.getFineAmount())
                .status(PaymentStatus.PENDING)
                .txnRef(txnRef)
                .createdAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        return buildVNPayUrl(payment);
    }

    // =====================================
    // BUILD VNPAY URL
    // =====================================
    private String buildVNPayUrl(Payment payment) {

        Map<String, String> vnpParams = new HashMap<>();

        vnpParams.put("vnp_Version", vnpayConfig.getVersion());
        vnpParams.put("vnp_Command", vnpayConfig.getCommand());
        vnpParams.put("vnp_TmnCode", vnpayConfig.getTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(payment.getAmount().longValue() * 100));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", payment.getTxnRef());
        vnpParams.put("vnp_OrderInfo", "Thanh toan tien phat borrowing " + payment.getBorrowing().getBorrowingId());
        vnpParams.put("vnp_OrderType", vnpayConfig.getOrderType());
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnpayConfig.getReturnUrl());
        vnpParams.put("vnp_IpAddr", "127.0.0.1");

        String queryUrl = VNPayUtil.buildQueryUrl(vnpParams);
        String secureHash = VNPayUtil.hmacSHA512(vnpayConfig.getHashSecret(), queryUrl);

        return vnpayConfig.getPayUrl() + "?" + queryUrl + "&vnp_SecureHash=" + secureHash;
    }

    // =====================================
    // HANDLE RETURN
    // =====================================
    @Override
    @Transactional
    public void handleVNPayReturn(Map<String, String> params) {

        String txnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");

        Payment payment = paymentRepository.findByTxnRef(txnRef)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if ("00".equals(responseCode)) {
            payment.setStatus(PaymentStatus.SUCCESS);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }

        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);
    }
}
package com.library.lmsproject.service.impl;

import com.library.lmsproject.config.VnpayConfig;
import com.library.lmsproject.service.PaymentService;
import com.library.lmsproject.utils.VnpayUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final VnpayConfig vnpayConfig;

    @Override
    public String createPaymentUrl(long amount, String orderInfo) {

        Map<String, String> vnpParams = new HashMap<>();

        vnpParams.put("vnp_Version", vnpayConfig.getVersion());
        vnpParams.put("vnp_Command", vnpayConfig.getCommand());
        vnpParams.put("vnp_TmnCode", vnpayConfig.getTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(amount * 100));
        vnpParams.put("vnp_CurrCode", "VND");

        String txnRef = String.valueOf(System.currentTimeMillis());
        vnpParams.put("vnp_TxnRef", txnRef);
        vnpParams.put("vnp_OrderInfo", orderInfo);
        vnpParams.put("vnp_OrderType", vnpayConfig.getOrderType());
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnpayConfig.getReturnUrl());
        vnpParams.put("vnp_IpAddr", "127.0.0.1");

        String queryUrl = VnpayUtils.buildQueryUrl(vnpParams);
        String secureHash = VnpayUtils.hmacSHA512(vnpayConfig.getHashSecret(), queryUrl);

        return vnpayConfig.getPayUrl() + "?" + queryUrl + "&vnp_SecureHash=" + secureHash;
    }
}
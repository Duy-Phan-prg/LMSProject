package com.library.lmsproject.controller;

import com.library.lmsproject.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public String createPayment(
            @RequestParam long amount,
            @RequestParam String orderInfo,
            HttpServletRequest request
    ) {
        return paymentService.createPaymentUrl(amount, orderInfo, request);
    }

    @GetMapping("/vnpay-return")
    public String vnpayReturn() {
        return "Thanh toán thành công (sandbox)";
    }
}
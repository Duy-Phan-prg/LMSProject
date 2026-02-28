package com.library.lmsproject.controller;

import com.library.lmsproject.dto.request.CreatePaymentRequest;
import com.library.lmsproject.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public String createPayment(@RequestBody CreatePaymentRequest request) throws Exception {
        return paymentService.createPayment(request);
    }

    @GetMapping("/vnpay-return")
    public String vnpayReturn(@RequestParam Map<String, String> params) {
        paymentService.handleVNPayReturn(params);
        return "Payment processed";
    }
}
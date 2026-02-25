package com.library.lmsproject.controller;

import com.library.lmsproject.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/create")
    public void createPayment(HttpServletResponse response) throws Exception {
        String paymentUrl = paymentService.createPaymentUrl(10000, "Test VNPay");
        response.sendRedirect(paymentUrl);
    }

    @GetMapping("/vnpay-return")
    public String paymentReturn(HttpServletRequest request) {
        return "Thanh toán thành công (demo)";
    }
}

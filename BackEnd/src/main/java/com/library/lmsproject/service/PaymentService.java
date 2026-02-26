package com.library.lmsproject.service;

import com.library.lmsproject.dto.request.CreatePaymentRequest;

public interface PaymentService {

    // tạo link thanh toán
    String createPayment(CreatePaymentRequest request) throws Exception;

    // xử lý return từ VNPay
    void handleVNPayReturn(java.util.Map<String, String> params);
}
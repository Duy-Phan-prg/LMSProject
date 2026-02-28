package com.library.lmsproject.service;

import com.library.lmsproject.dto.request.CreatePaymentRequest;

import java.util.Map;

public interface PaymentService {

    // tạo link thanh toán
    String createPayment(CreatePaymentRequest request) throws Exception;

    // xử lý return từ VNPay
    void handleVNPayReturn(Map <String, String> params);
}

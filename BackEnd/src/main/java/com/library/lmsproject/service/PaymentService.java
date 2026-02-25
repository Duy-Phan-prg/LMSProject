package com.library.lmsproject.service;

public interface PaymentService {
    String createPaymentUrl(long amount, String orderInfo);
}
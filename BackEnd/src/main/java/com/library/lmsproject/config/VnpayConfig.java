package com.library.lmsproject.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "vnpay")
@Data
public class VNPayConfig {
    public static final String VNP_TMN_CODE = "R7DDSF7T";
    public static final String VNP_HASH_SECRET = "9KDN14L32QF3SJ5W142H5RYMO3DUS97V";
    public static final String VNP_PAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static final String VNP_RETURN_URL = "http://localhost:8080/api/payment/vnpay-return";
    public static final String VNP_IPN_URL = "http://localhost:8080/api/payment/vnpay-ipn";
}
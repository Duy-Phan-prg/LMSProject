package com.library.lmsproject.utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import jakarta.servlet.http.HttpServletRequest;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

public class VNPayUtil {

    // ===== sort + build query =====
    public static String buildQueryUrl(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder query = new StringBuilder();

        try {
            for (String fieldName : fieldNames) {
                String value = params.get(fieldName);
                if (value != null && !value.isEmpty()) {
                    query.append(fieldName)
                            .append("=")
                            .append(URLEncoder.encode(value, StandardCharsets.US_ASCII))
                            .append("&");
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return query.substring(0, query.length() - 1);
    }

    // ===== hash SHA512 =====
    public static String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] hashBytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hash = new StringBuilder();
            for (byte b : hashBytes) {
                hash.append(String.format("%02x", b));
            }
            return hash.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error while hashing");
        }
    }

    // ===== thời gian =====
    public static String getCurrentTime() {
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        return formatter.format(cld.getTime());
    }

    public static String getExpireTime(int minutes) {
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        cal.add(Calendar.MINUTE, minutes);

        SimpleDateFormat formatter =
                new SimpleDateFormat("yyyyMMddHHmmss");

        return formatter.format(cal.getTime());
    }

    // ===== lấy IP =====
    public static String getIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-FORWARDED-FOR");

        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }

        // ⭐ FIX IPv6 localhost -> IPv4
        if ("0:0:0:0:0:0:0:1".equals(ipAddress)) {
            ipAddress = "127.0.0.1";
        }

        return ipAddress;
    }
}
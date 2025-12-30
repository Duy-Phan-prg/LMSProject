package com.Library.lmsproject.entity;

public enum BorrowStatus {
    PENDING_PICKUP("Đang chờ nhận sách"),
    ACTIVE("Đang mượn sách"),
    OVERDUE("Quá hạn trả sách"),
    RETURNED("Đã trả sách");

    private final String userMessage;

    BorrowStatus(String userMessage) {
        this.userMessage = userMessage;
    }

    public String getUserMessage() {
        return userMessage;
    }
}

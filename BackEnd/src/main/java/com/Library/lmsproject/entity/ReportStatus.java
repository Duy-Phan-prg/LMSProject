package com.library.lmsproject.entity;

public enum ReportStatus {

    PENDING("Cảnh báo đang chờ xử lý vi phạm"),
    VIOLATED("Đã xác nhận vi phạm"),
    IGNORED("Cảnh báo bị bỏ qua");

    private final String reportMessage;

    ReportStatus(String reportMessage) {
        this.reportMessage = reportMessage;
    }

    public String getReportMessage() {
        return reportMessage;
    }
}

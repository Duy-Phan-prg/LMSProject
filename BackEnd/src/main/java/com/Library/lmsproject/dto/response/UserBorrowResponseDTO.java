package com.Library.lmsproject.dto.response;

import com.Library.lmsproject.entity.BorrowStatus;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBorrowResponseDTO {
//    Khi user gọi /getAll, hệ thống lấy userId từ token (@AuthenticationPrincipal CustomUserDetails) → đảm bảo chỉ trả thông tin của chính user đó. ko caanf field userId nữa

    @Column(nullable = false, columnDefinition = "NVARCHAR(200)")
    private String bookTitle;

    private BorrowStatus status;
    private String statusMessage;

    private LocalDateTime requestAt;
    private LocalDate dueDate;

    private Double fineAmount;
    private String message;
}

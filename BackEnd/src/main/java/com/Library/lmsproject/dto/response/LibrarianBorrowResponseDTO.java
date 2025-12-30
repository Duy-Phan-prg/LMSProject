package com.Library.lmsproject.dto.response;

import com.Library.lmsproject.entity.BorrowStatus;
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
public class LibrarianBorrowResponseDTO {
    private Long borrowingId;

    private Long userId;
    private String userName;

    private Long bookId;
    private String bookTitle;

    private BorrowStatus status;

    private LocalDateTime requestAt;
    private LocalDateTime pickupAt;     // Giao sách
    private LocalDate dueDate;           // Hạn trả
    private LocalDateTime returnedAt;    // Trả thực tế

    private Integer overdueDays;
    private Double fineAmount;

    private String message;
}

package com.library.lmsproject.dto.response;

import com.library.lmsproject.entity.BorrowStatus;
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
    private LocalDateTime pickupAt;
    private LocalDate dueDate;
    private LocalDateTime returnedAt;

    private Integer overdueDays;
    private Double fineAmount;

    private String message;
}

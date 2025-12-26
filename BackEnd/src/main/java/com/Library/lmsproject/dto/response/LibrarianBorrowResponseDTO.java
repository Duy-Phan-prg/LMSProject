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
    private String userName;
    private String bookTitle;
    private BorrowStatus status;
    private LocalDateTime requestAt;
    private LocalDateTime pickupAt;
    private LocalDate dueDate;
    private LocalDateTime returnedAt;
    private String message;

}

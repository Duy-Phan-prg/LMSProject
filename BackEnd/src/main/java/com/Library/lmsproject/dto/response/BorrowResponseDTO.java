package com.Library.lmsproject.dto.response;

import com.Library.lmsproject.entity.BorrowStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BorrowResponseDTO {
    private Long borrowingId;
    private Long bookId;
    private String bookTitle;
    private BorrowStatus status;
    private LocalDate dueDate;

}

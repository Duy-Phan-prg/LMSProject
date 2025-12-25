package com.Library.lmsproject.dto.request;

import lombok.Data;

@Data
public class CreateBorrowRequestDTO {
    private Long bookId;
    private Long userId;
}
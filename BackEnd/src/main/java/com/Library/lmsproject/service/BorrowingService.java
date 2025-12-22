package com.Library.lmsproject.service;

import com.Library.lmsproject.dto.request.CreateBorrowRequestDTO;

public interface BorrowingService {
    void borrowBook(Long userId, CreateBorrowRequestDTO request);
}

package com.Library.lmsproject.service;

import com.Library.lmsproject.dto.request.BorrowRequestDTO;
import com.Library.lmsproject.dto.response.BorrowResponseDTO;

public interface BorrowingService {
    void borrowBook(Long userId, BorrowRequestDTO request);
}

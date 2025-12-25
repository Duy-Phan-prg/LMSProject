package com.Library.lmsproject.service;

import com.Library.lmsproject.dto.request.CreateBorrowRequestDTO;
import com.Library.lmsproject.dto.response.BorrowResponseDTO;

public interface BorrowingService {
    BorrowResponseDTO borrowBook(Long userId, CreateBorrowRequestDTO request);
}
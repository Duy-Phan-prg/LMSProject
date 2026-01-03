package com.Library.lmsproject.service;

import com.Library.lmsproject.dto.request.UserCreateBorrowRequestDTO;
import com.Library.lmsproject.dto.response.LibrarianBorrowResponseDTO;
import com.Library.lmsproject.dto.response.UserBorrowResponseDTO;
import com.Library.lmsproject.entity.BorrowStatus;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BorrowingService {

    // ================= USER =================
    UserBorrowResponseDTO cancelBorrowing(Long userId, Long borrowingId);

    // User tạo yêu cầu mượn
    UserBorrowResponseDTO borrowBook(Long userId, UserCreateBorrowRequestDTO request);

    // User xem danh sách mượn của CHÍNH MÌNH
    List<UserBorrowResponseDTO> getMyBorrowings(Long userId, BorrowStatus status);


    // ================= ADMIN / LIBRARIAN =================

    // Admin / Librarian xem TẤT CẢ borrowings
    Page<LibrarianBorrowResponseDTO> getAllBorrowings(String keyword, BorrowStatus status, int page, int size);

    LibrarianBorrowResponseDTO getBorrowingDetails(Long borrowingId);

    // Librarian giao sách
    void pickupBook(Long borrowingId, Integer borrowDays);

    LibrarianBorrowResponseDTO returnBook(Long borrowingId);
}
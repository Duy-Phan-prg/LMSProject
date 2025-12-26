package com.Library.lmsproject.service;

import com.Library.lmsproject.dto.request.UserCreateBorrowRequestDTO;
import com.Library.lmsproject.dto.response.LibrarianBorrowResponseDTO;
import com.Library.lmsproject.dto.response.UserBorrowResponseDTO;

import java.util.List;

public interface BorrowingService {
    UserBorrowResponseDTO borrowBook(Long userId, UserCreateBorrowRequestDTO request);
    List<UserBorrowResponseDTO> getAllUserBorrowings(Long userId);
    List<LibrarianBorrowResponseDTO> getAllPending();
    List<LibrarianBorrowResponseDTO> getAllActive();
    List<LibrarianBorrowResponseDTO> getAllOverdue();
    List<LibrarianBorrowResponseDTO> getAllReturned();

//    //Cho librarian duyet muon sach :)))
//    LibrarianBorrowResponseDTO approveBorrowing(Long borrowingId);
//    LibrarianBorrowResponseDTO markReturned(Long borrowingId);
}
package com.Library.lmsproject.service;

import com.Library.lmsproject.dto.request.UserCreateBorrowRequestDTO;
import com.Library.lmsproject.dto.response.LibrarianBorrowResponseDTO;
import com.Library.lmsproject.dto.response.UserBorrowResponseDTO;
import com.Library.lmsproject.entity.BorrowStatus;

import java.util.List;

public interface BorrowingService {
    UserBorrowResponseDTO borrowBook(Long userId, UserCreateBorrowRequestDTO request);

    List<UserBorrowResponseDTO> getAllAndSearchByStatus(BorrowStatus status);

//    //Cho librarian duyet muon sach :)))
//    LibrarianBorrowResponseDTO approveBorrowing(Long borrowingId);
//    LibrarianBorrowResponseDTO markReturned(Long borrowingId);
}
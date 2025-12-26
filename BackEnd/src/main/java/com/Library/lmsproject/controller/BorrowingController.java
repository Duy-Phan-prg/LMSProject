package com.Library.lmsproject.controller;



import com.Library.lmsproject.dto.request.UserCreateBorrowRequestDTO;
import com.Library.lmsproject.dto.response.LibrarianBorrowResponseDTO;
import com.Library.lmsproject.dto.response.UserBorrowResponseDTO;
import com.Library.lmsproject.security.CustomUserDetails;
import com.Library.lmsproject.service.BorrowingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrowings")
@RequiredArgsConstructor
public class BorrowingController {

    private final BorrowingService borrowingService;

    @PostMapping("/createBorrow")
    public ResponseEntity<UserBorrowResponseDTO> borrowBook(
            @RequestParam Long userId,
            @RequestBody UserCreateBorrowRequestDTO request
    ) {
        UserBorrowResponseDTO response = borrowingService.borrowBook(userId, request);
        return ResponseEntity.ok(response);
    }

    //  Lấy hết danh sách borrow request để user coi
    @GetMapping("/getAll")
    public ResponseEntity<List<UserBorrowResponseDTO>> getAllUserBorrowings(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getId();
        List<UserBorrowResponseDTO> list = borrowingService.getAllUserBorrowings(userId);
        return ResponseEntity.ok(list);
    }
    //LIBRARIAN xem danh sach borrow bending request cua tat ca user
    @GetMapping("/getAllPending")
    public ResponseEntity<List<LibrarianBorrowResponseDTO>> getAllPending() {
        List<LibrarianBorrowResponseDTO> pendingList = borrowingService.getAllPending();
        return ResponseEntity.ok(pendingList);
    }



}

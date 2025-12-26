package com.Library.lmsproject.service.impl;

import com.Library.lmsproject.dto.request.UserCreateBorrowRequestDTO;
import com.Library.lmsproject.dto.response.LibrarianBorrowResponseDTO;
import com.Library.lmsproject.dto.response.UserBorrowResponseDTO;
import com.Library.lmsproject.entity.Books;
import com.Library.lmsproject.entity.BorrowStatus;
import com.Library.lmsproject.entity.Borrowings;
import com.Library.lmsproject.entity.Users;
import com.Library.lmsproject.mapper.BorrowMapper;
import com.Library.lmsproject.repository.BookRepository;
import com.Library.lmsproject.repository.BorrowingRepository;
import com.Library.lmsproject.repository.UsersRepository;
import com.Library.lmsproject.service.BorrowingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BorrowingServiceImpl implements BorrowingService {

    private final UsersRepository usersRepository;
    private final BookRepository bookRepository;
    private final BorrowingRepository borrowingRepository;
    private final BorrowMapper borrowMapper;
    @Override
    public UserBorrowResponseDTO borrowBook(Long userId, UserCreateBorrowRequestDTO request) {

        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Books book = bookRepository.findByBookIdAndIsActive(
                request.getBookId(), true
        ).orElseThrow(() -> new RuntimeException("Book not found"));

        boolean borrowed = borrowingRepository.existsByUserAndBookAndStatusIn(
                user,
                book,
                List.of(
                        BorrowStatus.PENDING_PICKUP,
                        BorrowStatus.ACTIVE,
                        BorrowStatus.OVERDUE
                )
        );

        if (borrowed) {
            throw new RuntimeException("You already borrowed this book");
        }

        Borrowings borrowing = new Borrowings();
        borrowing.setUser(user);
        borrowing.setBook(book);
        borrowing.setStatus(BorrowStatus.PENDING_PICKUP);
        borrowing.setRequestAt(LocalDateTime.now());
        borrowing.setDueDate(LocalDate.now().plusDays(14));

        borrowingRepository.save(borrowing);

        UserBorrowResponseDTO response = borrowMapper.toResponse(borrowing);
        response.setMessage("Borrow request submitted");

        return response;
    }

    public List<UserBorrowResponseDTO> getAllUserBorrowings(Long userId) {
        List<Borrowings> list = borrowingRepository.findByUserId(userId);
        return list.stream()
                .map(borrowMapper::toResponse)
                .peek(dto -> dto.setMessage("Borrow info")) // set message tùy ý
                .collect(Collectors.toList());
    }

    @Override
    public List<LibrarianBorrowResponseDTO> getAllPending() {
        List<Borrowings> list = borrowingRepository.findByStatus(BorrowStatus.PENDING_PICKUP);
        return list.stream()
                .map(borrowMapper::toLibrarianResponse)
                .peek(dto -> dto.setMessage("Waiting for pickup"))
                .collect(Collectors.toList());
    }
}
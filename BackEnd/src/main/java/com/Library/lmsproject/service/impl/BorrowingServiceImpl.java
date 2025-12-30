package com.Library.lmsproject.service.impl;

import com.Library.lmsproject.dto.request.UserCreateBorrowRequestDTO;
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

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BorrowingServiceImpl implements BorrowingService {

    private final UsersRepository usersRepository;
    private final BookRepository bookRepository;
    private final BorrowingRepository borrowingRepository;
    private final BorrowMapper borrowMapper;
    @Transactional
    @Override
    public UserBorrowResponseDTO borrowBook(Long userId, UserCreateBorrowRequestDTO request) {

        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Books book = bookRepository.findByBookIdAndIsActive(
                request.getBookId(), true
        ).orElseThrow(() -> new RuntimeException("Book not found"));

        // 1️⃣ Kiểm tra đã mượn chưa
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

        // 2️⃣ Kiểm tra kho
        if (book.getCopiesAvailable() <= 0) {
            throw new RuntimeException("Book is out of stock");
        }

        // 3️⃣ Trừ kho
        book.setCopiesAvailable(book.getCopiesAvailable() - 1);

        // 4️⃣ Tạo borrowing
        Borrowings borrowing = new Borrowings();
        borrowing.setUser(user);
        borrowing.setBook(book);
        borrowing.setStatus(BorrowStatus.PENDING_PICKUP);
        borrowing.setRequestAt(LocalDateTime.now());

        borrowingRepository.save(borrowing);

        UserBorrowResponseDTO response = borrowMapper.toResponse(borrowing);
        response.setMessage("Borrow request submitted");

        return response;
    }

    @Override
    public List<UserBorrowResponseDTO> getAllAndSearchByStatus(BorrowStatus status) {

        List<Borrowings> borrowings;

        if (status == null) {
            borrowings = borrowingRepository.findAll();
        } else {
            borrowings = borrowingRepository.findByStatus(status);
        }

        return borrowings.stream()
                .map(borrowMapper::toResponse)
                .toList();
    }


}
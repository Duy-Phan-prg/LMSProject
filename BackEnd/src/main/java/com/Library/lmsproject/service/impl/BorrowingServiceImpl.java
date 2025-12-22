package com.Library.lmsproject.service.impl;

import com.Library.lmsproject.dto.request.BorrowRequestDTO;
import com.Library.lmsproject.entity.Books;
import com.Library.lmsproject.entity.BorrowStatus;
import com.Library.lmsproject.entity.Borrowings;
import com.Library.lmsproject.entity.Users;
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

    @Override
    public void borrowBook(Long userId, BorrowRequestDTO request) {

        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Books book = bookRepository.findByBookIdAndIsActive(
                request.getBookId(), true
        ).orElseThrow(() -> new RuntimeException("Book not found"));


        if (book.getCopiesAvailable() <= 0) {
            throw new RuntimeException("Book is out of stock");
        }


        boolean borrowed = borrowingRepository.existsByUserAndBookAndStatusIn(
                user,
                book,
                List.of(
                        BorrowStatus.PENDING_PICKUP,
                        BorrowStatus.ACTIVE
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

        borrowingRepository.save(borrowing);


        book.setCopiesAvailable(book.getCopiesAvailable() - 1);
        bookRepository.save(book);
    }
}

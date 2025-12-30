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
    @Override
    @Transactional
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

        if (book.getCopiesAvailable() <= 0) {
            throw new RuntimeException("Book is out of stock");
        }

        book.setCopiesAvailable(book.getCopiesAvailable() - 1);

        Borrowings borrowing = new Borrowings();
        borrowing.setUser(user);
        borrowing.setBook(book);
        borrowing.setStatus(BorrowStatus.PENDING_PICKUP);
        borrowing.setRequestAt(LocalDateTime.now());
        borrowing.setFineAmount(0.0);

        borrowingRepository.save(borrowing);

        UserBorrowResponseDTO dto = borrowMapper.toUserResponse(borrowing);
        dto.setMessage(BorrowStatus.PENDING_PICKUP.getUserMessage());

        return dto;
    }


    @Override
    public List<UserBorrowResponseDTO> getAllAndSearchByStatus(BorrowStatus status) {

        List<Borrowings> borrowings =
                (status == null)
                        ? borrowingRepository.findAll()
                        : borrowingRepository.findByStatus(status);

        return borrowings.stream()
                .map(b -> {
                    UserBorrowResponseDTO dto = borrowMapper.toUserResponse(b);
                    dto.setMessage(b.getStatus().getUserMessage());
                    return dto;
                })
                .toList();
    }



}
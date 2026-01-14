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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BorrowingServiceImpl implements BorrowingService {

    private final UsersRepository usersRepository;
    private final BookRepository bookRepository;
    private final BorrowingRepository borrowingRepository;
    private final BorrowMapper borrowMapper;

    // ================= USER =================
    @Transactional
    public UserBorrowResponseDTO cancelBorrowing(
            Long userId,
            Long borrowingId
    ) {

        Borrowings borrowing = borrowingRepository.findById(borrowingId)
                .orElseThrow(() -> new RuntimeException("Borrowing not found"));

        if (!borrowing.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        if (borrowing.getStatus() != BorrowStatus.PENDING_PICKUP) {
            throw new RuntimeException(
                    "Only PENDING_PICKUP borrowing can be canceled"
            );
        }

        Books book = borrowing.getBook();
        book.setCopiesAvailable(book.getCopiesAvailable() + 1);

        borrowing.setStatus(BorrowStatus.CANCELED);

        borrowingRepository.save(borrowing);

        UserBorrowResponseDTO dto =
                borrowMapper.toUserResponse(borrowing);
        dto.setMessage(BorrowStatus.CANCELED.getUserMessage());

        return dto;
    }


    @Transactional
    @Override
    public UserBorrowResponseDTO borrowBook(
            Long userId,
            UserCreateBorrowRequestDTO request
    ) {

        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Books book = bookRepository
                .findByBookIdAndIsActive(request.getBookId(), true)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        int alreadyBorrowed =
                borrowingRepository.existsByUserAndBookAndStatusIn(
                        user,
                        book,
                        List.of(
                                BorrowStatus.PENDING_PICKUP,
                                BorrowStatus.ACTIVE,
                                BorrowStatus.OVERDUE
                        )
                );

        if (alreadyBorrowed >= 5) {
            throw new RuntimeException("Chỉ được mượn tối đa 5 cuốn sách cùng lúc");
        }

        if (book.getCopiesAvailable() <= 0) {
            throw new RuntimeException("Book is out of stock");
        }

        // Trừ sách
        book.setCopiesAvailable(book.getCopiesAvailable() - 1);

        Borrowings borrowing = new Borrowings();
        borrowing.setUser(user);
        borrowing.setBook(book);
        borrowing.setStatus(BorrowStatus.PENDING_PICKUP);
        borrowing.setRequestAt(LocalDateTime.now());
        borrowing.setFineAmount(0.0);

        borrowingRepository.save(borrowing);

        UserBorrowResponseDTO dto =
                borrowMapper.toUserResponse(borrowing);
        dto.setMessage(BorrowStatus.PENDING_PICKUP.getUserMessage());

        return dto;
    }
    @Override
    @Transactional
    public List<UserBorrowResponseDTO> getMyBorrowings(
            Long userId,
            BorrowStatus status
    ) {

        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Borrowings> borrowings =
                (status == null)
                        ? borrowingRepository.findByUser(user)
                        : borrowingRepository.findByUserAndStatus(user, status);

        return borrowings.stream()
                .map(b -> {
                    UserBorrowResponseDTO dto =
                            borrowMapper.toUserResponse(b);
                    dto.setMessage(b.getStatus().getUserMessage());
                    return dto;
                })
                .toList();
    }
    // ================= LIBRARIAN / ADMIN =================
    @Override
    public LibrarianBorrowResponseDTO updateStatus(
            Long borrowingId,
            BorrowStatus status
    ) {

        Borrowings borrowing = borrowingRepository.findById(borrowingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu mượn"));

        switch (status) {

            case RETURNED -> {
                if (borrowing.getStatus() != BorrowStatus.ACTIVE
                        && borrowing.getStatus() != BorrowStatus.OVERDUE) {
                    throw new RuntimeException("Chỉ được trả sách khi đang mượn");
                }

                borrowing.setStatus(BorrowStatus.RETURNED);

                LocalDateTime returnedAt = LocalDateTime.now();
                borrowing.setReturnedAt(returnedAt);

                int overdueDays = 0;
                if (returnedAt.toLocalDate().isAfter(borrowing.getDueDate())) {
                    overdueDays = (int) ChronoUnit.DAYS.between(
                            borrowing.getDueDate(),
                            returnedAt.toLocalDate()
                    );
                }

                borrowing.setFineAmount((double) (overdueDays * 5000));


                Books book = borrowing.getBook();
                book.setCopiesAvailable(book.getCopiesAvailable() + 1);
            }
            case EXPIRED_PICKUP -> {

                if (borrowing.getStatus() != BorrowStatus.PENDING_PICKUP) {
                    throw new RuntimeException("Chỉ được đánh dấu quá hạn khi chưa nhận sách");
                }

                // quá 1 ngày kể từ lúc request
                LocalDateTime deadline = borrowing.getRequestAt().plusDays(1);
                if (LocalDateTime.now().isBefore(deadline)) {
                    throw new RuntimeException("Chưa quá hạn nhận sách");
                }

                // cộng lại sách
                Books book = borrowing.getBook();
                book.setCopiesAvailable(book.getCopiesAvailable() + 1);

                borrowing.setStatus(BorrowStatus.EXPIRED_PICKUP);
                borrowing.setMessage("Quá 1 ngày chưa đến nhận sách");
            }

            default -> throw new RuntimeException("Không hỗ trợ trạng thái này");
        }

        borrowingRepository.save(borrowing);
        return borrowMapper.toLibrarianResponse(borrowing);
    }


    public Page<LibrarianBorrowResponseDTO> getAllBorrowings(
            String keyword,
            BorrowStatus status,
            int page,
            int size
    ) {

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by("requestAt").descending()
                );

        Page<Borrowings> borrowingsPage =
                borrowingRepository.searchBorrowings(
                        status,
                        keyword,
                        pageable
                );

        return borrowingsPage.map(b -> {
            LibrarianBorrowResponseDTO dto =
                    borrowMapper.toLibrarianResponse(b);
            dto.setMessage(b.getStatus().name());
            return dto;
        });
    }

    @Override
    public LibrarianBorrowResponseDTO getBorrowingDetails(Long borrowingId) {
        Borrowings borrowing = borrowingRepository.findById(borrowingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu mượn sách"));

        LibrarianBorrowResponseDTO response =
                borrowMapper.toLibrarianResponse(borrowing);

        // tính overdueDays nếu cần
        if (borrowing.getDueDate() != null
                && borrowing.getReturnedAt() == null
                && borrowing.getDueDate().isBefore(LocalDate.now())) {

            long overdueDays = ChronoUnit.DAYS.between(
                    borrowing.getDueDate(),
                    LocalDate.now()
            );
            response.setOverdueDays((int) overdueDays);
        }

        response.setMessage("Lấy chi tiết yêu cầu mượn sách thành công");
        return response;
    }


    @Override
    public void pickupBook(
            Long borrowingId,
            Integer borrowDays
    ) {

        Borrowings borrowing = borrowingRepository.findById(borrowingId)
                .orElseThrow(() -> new RuntimeException("Borrowing not found"));

        if (borrowing.getStatus() != BorrowStatus.PENDING_PICKUP) {
            throw new RuntimeException(
                    "Borrowing is not in PENDING_PICKUP status"
            );
        }

        if (borrowDays == null || borrowDays <= 0 || borrowDays > 14) {
            throw new RuntimeException("Invalid borrow days");
        }

        LocalDateTime pickupAt = LocalDateTime.now();
        borrowing.setPickupAt(pickupAt);

        borrowing.setDueDate(
                pickupAt.toLocalDate().plusDays(borrowDays)
        );

        borrowing.setStatus(BorrowStatus.ACTIVE);

        borrowingRepository.save(borrowing);
    }



}
package com.Library.lmsproject.repository;

import com.Library.lmsproject.entity.Books;
import com.Library.lmsproject.entity.BorrowStatus;
import com.Library.lmsproject.entity.Borrowings;
import com.Library.lmsproject.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BorrowingRepository extends JpaRepository<Borrowings, Long> {

    boolean existsByUserAndBookAndStatusIn(
            Users user,
            Books book,
            List<BorrowStatus> statuses
    );

    // Thêm method này để lấy nhiều status cùng lúc
    List<Borrowings> findByStatus(BorrowStatus status);


    List<Borrowings> findByUser(Users user);

    List<Borrowings> findByUserAndStatus(Users user, BorrowStatus status);
}

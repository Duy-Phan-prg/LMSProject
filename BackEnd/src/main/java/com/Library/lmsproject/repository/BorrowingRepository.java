package com.library.lmsproject.repository;

import com.library.lmsproject.entity.Books;
import com.library.lmsproject.entity.BorrowStatus;
import com.library.lmsproject.entity.Borrowings;
import com.library.lmsproject.entity.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BorrowingRepository extends JpaRepository<Borrowings, Long> {

    boolean existsByUserAndBookAndStatusIn(
            Users user,
            Books book,
            List<BorrowStatus> statuses
    );
    int countByUserAndStatusIn(
            Users user,
            List<BorrowStatus> statuses
    );


    boolean existsByUserAndBookAndStatus(
            Users user,
            Books book,
            BorrowStatus status
    );


    List<Borrowings> findByUser(Users user);

    List<Borrowings> findByUserAndStatus(Users user, BorrowStatus status);

    @Query("""
        SELECT b
        FROM Borrowings b
        WHERE
            (:status IS NULL OR b.status = :status)
        AND
            (:keyword IS NULL OR
             LOWER(b.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')))
    """)
    Page<Borrowings> searchBorrowings(
            @Param("status") BorrowStatus status,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}

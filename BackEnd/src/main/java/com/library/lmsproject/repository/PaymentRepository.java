package com.library.lmsproject.repository;

import com.library.lmsproject.entity.Borrowings;
import com.library.lmsproject.entity.Payment;
import com.library.lmsproject.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    boolean existsByBorrowingAndStatus(Borrowings borrowing, PaymentStatus status);

    Optional<Payment> findByTxnRef(String txnRef);
}

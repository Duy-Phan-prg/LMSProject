package com.Library.lmsproject.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "borrowings",
        indexes = {
                @Index(name = "idx_user_status", columnList = "user_id, status"),
                @Index(name = "idx_book_status", columnList = "book_id, status"),
                @Index(name = "idx_due_date", columnList = "due_date")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Borrowings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long borrowingId;

    // ===== USER =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    // ===== BOOK =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Books book;

    // ===== STATUS =====
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BorrowStatus status;

    // ===== TIME =====
    private LocalDateTime requestAt;
    private LocalDateTime pickupAt;
    private LocalDate dueDate;
    private LocalDateTime returnedAt;



    // ===== OVERDUE & FINE =====
    private Integer overdueDays; //cần cho librarian xử lý & tính phạt
    private Double fineAmount; //user cần biết bị phạt bao nhiêu

    // ===== NOTE =====
    @Column(length = 500)
    private String message;
}



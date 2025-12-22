package com.Library.lmsproject.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "borrowings",
        indexes = {
                @Index(name = "idx_user_status", columnList = "user_id, status"),
                @Index(name = "idx_book_status", columnList = "book_id, status"),
                @Index(name = "idx_due_date", columnList = "due_date")
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Borrowings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "borrowing_id")
    private Long borrowingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Books book;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BorrowingStatus status;

    @Column(name = "request_at", nullable = false)
    private LocalDateTime requestAt;

    @Column(name = "due_date")
    private LocalDate dueDate;
}

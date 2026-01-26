package com.library.lmsproject.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "review_reports",
        uniqueConstraints = @UniqueConstraint(columnNames = {"review_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    @ManyToOne
    @JoinColumn(name = "reported_by", nullable = false)
    private Users reportedBy;

    @Column(nullable = false, columnDefinition = "NVARCHAR(500)")
    private String reason;

    // luôn = true (đã vi phạm)
    private Boolean isViolated = true;

    private LocalDateTime createdAt;
}


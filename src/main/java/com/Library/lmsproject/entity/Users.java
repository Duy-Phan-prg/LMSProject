package com.Library.lmsproject.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, columnDefinition = "NVARCHAR(100)")
    private String fullName;

    @Enumerated(EnumType.STRING)
    private Roles role;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String address;

    private boolean isActive = true;

    private String avatar;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


}

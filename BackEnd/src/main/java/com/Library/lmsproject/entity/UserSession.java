package com.Library.lmsproject.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class UserSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    @Column(nullable = false, unique = true, length = 500)
    private String sessionToken;

    @Column(nullable = false)
    private String tokenType; // ACCESS | REFRESH

    @Column(nullable = false)
    private Boolean isActive = true;

    private LocalDateTime loginTime;
    private LocalDateTime logoutTime;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;


}

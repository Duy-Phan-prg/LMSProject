package com.Library.lmsproject.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "user")
    private Set<Borrowings> borrowings;

    // ================= BASIC =================
    @Column(nullable = false, unique = true)
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    // LOCAL cần, GOOGLE không
    private String password;

    @Column(nullable = false, columnDefinition = "NVARCHAR(100)")
    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Roles role;

    // ================= OAUTH =================
    @Column(nullable = false, columnDefinition = "bit default 0")
    private boolean isOauth2User = false;

    private String provider;
    private String providerId;

    // ================= OPTIONAL =================
    // Google không trả 2 field này
    private String phone;
    private String address;

    private String avatar;

    // ================= JWT =================
    @Column(length = 500)
    private String refreshToken;

    // ================= SYSTEM =================
    @Column(nullable = false)
    private boolean isActive = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}

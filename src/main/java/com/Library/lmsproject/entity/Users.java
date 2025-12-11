package com.Library.lmsproject.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;

    @Column(nullable = false, columnDefinition = "NVARCHAR(100)")
    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Roles role;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

    @Column(nullable = false)
    private boolean isActive = true;

    private String avatar;

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

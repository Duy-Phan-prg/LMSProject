package com.Library.lmsproject.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterRequestDTO {

    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Email là bắt buộc")
    private String email;

    @NotBlank(message = "Mật khẩu là bắt buộc")
    @Size(min = 6, max = 20, message = "Mật khẩu phải từ 6 đến 20 ký tự")
    private String password;

    @NotBlank(message = "Họ và tên là bắt buộc")
    @Size(max = 50, message = "Họ và tên không được vượt quá 50 ký tự")
    private String fullName;

    @NotBlank(message = "Số điện thoại là bắt buộc")
    @Pattern(regexp = "^(\\+84|0)\\d{9,10}$", message = "Số điện thoại không hợp lệ")
    private String phone;

    private String address;
}

package com.Library.lmsproject.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterRequestDTO {

    @NotBlank(message = "Email là bắt buộc")
    @Email(message = "Email không hợp lệ")
    @Size(max = 100, message = "Email không được vượt quá 100 ký tự")
    private String email;

    @NotBlank(message = "Mật khẩu là bắt buộc")
    @Size(min = 6, max = 20, message = "Mật khẩu phải từ 6 đến 20 ký tự")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,20}$",
            message = "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
    )
    private String password;

    @NotBlank(message = "Họ và tên là bắt buộc")
    @Size(max = 50, message = "Họ và tên không được vượt quá 50 ký tự")
    @Pattern(
            regexp = "^[\\p{L} ]+$",
            message = "Họ và tên chỉ được chứa chữ cái và khoảng trắng"
    )
    private String fullName;

    @NotBlank(message = "Số điện thoại là bắt buộc")
    @Pattern(
            regexp = "^(\\+84|0)\\d{9,10}$",
            message = "Số điện thoại không hợp lệ"
    )
    private String phone;

    @NotBlank(message = "Địa chỉ là bắt buộc")
    @Size(max = 200, message = "Địa chỉ không được vượt quá 200 ký tự")
    private String address;
}

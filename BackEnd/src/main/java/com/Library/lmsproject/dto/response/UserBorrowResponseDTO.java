package com.Library.lmsproject.dto.response;

import com.Library.lmsproject.entity.BorrowStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBorrowResponseDTO {
//    Khi user gọi /getAll, hệ thống lấy userId từ token (@AuthenticationPrincipal CustomUserDetails) → đảm bảo chỉ trả thông tin của chính user đó. ko caanf field userId nữa
    private Long userId;
    private String userName;
    private String bookTitle;

    private BorrowStatus status;
    private LocalDateTime requestAt;
    private String message;

}

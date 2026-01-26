package com.library.lmsproject.dto.request;

import com.library.lmsproject.entity.BorrowStatus;
import lombok.Data;

@Data
public class UpdateBorrowingStatusRequestDTO {
    private BorrowStatus status;
}

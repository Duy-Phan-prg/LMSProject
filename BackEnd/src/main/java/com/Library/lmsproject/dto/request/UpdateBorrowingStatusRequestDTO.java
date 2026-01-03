package com.Library.lmsproject.dto.request;

import com.Library.lmsproject.entity.BorrowStatus;
import lombok.Data;

@Data
public class UpdateBorrowingStatusRequestDTO {
    private BorrowStatus status;
}

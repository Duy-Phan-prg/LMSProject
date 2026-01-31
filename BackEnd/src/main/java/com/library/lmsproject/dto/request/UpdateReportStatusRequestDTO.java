package com.library.lmsproject.dto.request;

import com.library.lmsproject.entity.ReportStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateReportStatusRequestDTO
{
    @NotNull(message = "Status is required")
    private ReportStatus status;
}

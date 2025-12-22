package com.Library.lmsproject.mapper;

import com.Library.lmsproject.dto.response.BorrowResponseDTO;
import com.Library.lmsproject.entity.Borrowings;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BorrowMapper {

    @Mapping(source = "book.bookId", target = "bookId")
    @Mapping(source = "book.title", target = "bookTitle")
    BorrowResponseDTO toResponse(Borrowings borrowing);
}
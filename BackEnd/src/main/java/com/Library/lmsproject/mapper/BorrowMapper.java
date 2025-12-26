package com.Library.lmsproject.mapper;

import com.Library.lmsproject.dto.response.LibrarianBorrowResponseDTO;
import com.Library.lmsproject.dto.response.UserBorrowResponseDTO;
import com.Library.lmsproject.entity.Borrowings;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BorrowMapper {
    // Mapping cho User (ít field hơn)
    @Mapping(source = "user.fullName", target = "userName")
    @Mapping(source = "book.title", target = "bookTitle")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "requestAt", target = "requestAt")
    @Mapping(target = "message", ignore = true) // message sẽ set sau
    UserBorrowResponseDTO toResponse(Borrowings borrowing);

    // Mapping cho Librarian (đầy đủ field)
    @Mapping(source = "borrowingId", target = "borrowingId")
    @Mapping(source = "user.fullName", target = "userName")
    @Mapping(source = "book.title", target = "bookTitle")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "requestAt", target = "requestAt")
    @Mapping(source = "pickupAt", target = "pickupAt")
    @Mapping(source = "dueDate", target = "dueDate")
    @Mapping(source = "returnedAt", target = "returnedAt")
    @Mapping(target = "message", ignore = true) // message sẽ set sau
    LibrarianBorrowResponseDTO toLibrarianResponse(Borrowings borrowing);
}
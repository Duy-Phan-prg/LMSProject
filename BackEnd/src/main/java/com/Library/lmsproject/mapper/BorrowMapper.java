package com.Library.lmsproject.mapper;

import com.Library.lmsproject.dto.response.LibrarianBorrowResponseDTO;
import com.Library.lmsproject.dto.response.UserBorrowResponseDTO;
import com.Library.lmsproject.entity.Borrowings;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BorrowMapper {


    // ================= USER =================
    @Mapping(source = "borrowingId", target = "borrowingId")
    @Mapping(source = "book.title", target = "bookTitle")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "status.userMessage", target = "statusMessage")
    @Mapping(source = "requestAt", target = "requestAt")
    @Mapping(source = "dueDate", target = "dueDate")
    @Mapping(source = "fineAmount", target = "fineAmount")
    @Mapping(target = "message", ignore = true)
    UserBorrowResponseDTO toUserResponse(Borrowings borrowing);


    // ================= LIBRARIAN =================
    @Mapping(source = "borrowingId", target = "borrowingId")

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.fullName", target = "userName")

    @Mapping(source = "book.bookId", target = "bookId")
    @Mapping(source = "book.title", target = "bookTitle")

    @Mapping(source = "status", target = "status")
    @Mapping(source = "requestAt", target = "requestAt")
    @Mapping(source = "pickupAt", target = "pickupAt")
    @Mapping(source = "dueDate", target = "dueDate")
    @Mapping(source = "returnedAt", target = "returnedAt")

    @Mapping(source = "fineAmount", target = "fineAmount")
    @Mapping(target = "overdueDays", ignore = true) // tính ở service
    @Mapping(target = "message", ignore = true)
    LibrarianBorrowResponseDTO toLibrarianResponse(Borrowings borrowing);
}
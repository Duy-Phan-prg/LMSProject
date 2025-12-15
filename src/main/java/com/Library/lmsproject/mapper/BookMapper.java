package com.Library.lmsproject.mapper;

import com.Library.lmsproject.dto.request.CreateBookRequestDTO;
import com.Library.lmsproject.dto.response.BookResponseDTO;
import com.Library.lmsproject.entity.Books;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BookMapper {
    //request sang entity va entity sang response
    Books toEntity(CreateBookRequestDTO request);


    BookResponseDTO toResponseDTO(Books book);
}
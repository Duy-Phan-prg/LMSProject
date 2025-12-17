package com.Library.lmsproject.mapper;

import com.Library.lmsproject.dto.request.CreateBookRequestDTO;
import com.Library.lmsproject.dto.request.UpdateBookRequestDTO;
import com.Library.lmsproject.dto.response.BookResponseDTO;
import com.Library.lmsproject.entity.Books;
import com.Library.lmsproject.entity.Categories;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface BookMapper {
    //request sang entity va entity sang response
    Books toEntity(CreateBookRequestDTO request);

    @Mapping(source = "categories", target = "categories")
    BookResponseDTO toResponseDTO(Books book);

    void updateBookFromDto(UpdateBookRequestDTO dto, @MappingTarget Books book);

    default Set<String> map(Set<Categories> categories) {
        if (categories == null) {
            return Set.of();
        }
        return categories.stream()
                .map(Categories::getCategoryName)
                .collect(Collectors.toSet());
    }
}
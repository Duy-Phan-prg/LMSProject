package com.library.lmsproject.mapper;

import com.library.lmsproject.dto.request.CreateCategoryRequestDTO;
import com.library.lmsproject.dto.response.CategoryResponseDTO;
import com.library.lmsproject.entity.Categories;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "active", constant = "true")
    @Mapping(target = "categoryId", ignore = true)
    @Mapping(target = "books", ignore = true)
    Categories toEntity(CreateCategoryRequestDTO dto );

    @Mapping(target = "active", source = "active")
    CategoryResponseDTO toResponseDTO(Categories category);

}

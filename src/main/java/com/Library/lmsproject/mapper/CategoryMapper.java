package com.Library.lmsproject.mapper;

import com.Library.lmsproject.dto.request.CreateCategoryRequestDTO;
import com.Library.lmsproject.dto.response.CategoryResponseDTO;
import com.Library.lmsproject.entity.Categories;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    //request sang entity va entity sang response
    Categories toEntity(CreateCategoryRequestDTO dto );

    CategoryResponseDTO toResponseDTO(Categories category);
}

package com.Library.lmsproject.service;

import com.Library.lmsproject.dto.request.CreateCategoryRequestDTO;
import com.Library.lmsproject.dto.request.UpdateCategoryRequestDTO;
import com.Library.lmsproject.dto.response.CategoryResponseDTO;
import org.springframework.data.domain.Page;

public interface CategoryService {
    CategoryResponseDTO createCategory(CreateCategoryRequestDTO request);

    Page<CategoryResponseDTO> getAllCategories(int page, int size, String keyword);

    Boolean deleteCategory(Long categoryId);

    CategoryResponseDTO updateCategory(Long categoryId,
                                       UpdateCategoryRequestDTO request);
    CategoryResponseDTO getCategoryById(Long categoryId);
}

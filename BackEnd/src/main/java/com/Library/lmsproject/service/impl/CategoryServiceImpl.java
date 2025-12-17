package com.Library.lmsproject.service.impl;


import com.Library.lmsproject.dto.request.CreateCategoryRequestDTO;
import com.Library.lmsproject.dto.request.UpdateCategoryRequestDTO;
import com.Library.lmsproject.dto.response.CategoryResponseDTO;
import com.Library.lmsproject.entity.Categories;
import com.Library.lmsproject.mapper.CategoryMapper;
import com.Library.lmsproject.repository.CategoryRespository;
import com.Library.lmsproject.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRespository categoryRespository;
    private final CategoryMapper categoryMapper;

    @Override
    public CategoryResponseDTO createCategory(CreateCategoryRequestDTO request) {
        categoryRespository.findByCategoryName(request.getCategoryName())
                .ifPresent(c -> {
                    throw new RuntimeException("Category already exists");
                });

        Categories category = categoryMapper.toEntity(request);

        Categories savedCategory = categoryRespository.save(category);

        return categoryMapper.toResponseDTO(savedCategory);
    }

    @Override
    public Page<CategoryResponseDTO> getAllCategories(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Categories> categoriesPage;
        if (keyword != null && !keyword.isBlank()) {
            categoriesPage = categoryRespository.searchActiveCategories(keyword, pageable);
        } else {
            categoriesPage = categoryRespository.findByIsActive(true, pageable);
        }
        return categoriesPage.map(categoryMapper::toResponseDTO);
    }

    @Override
    public Boolean deleteCategory(Long categoryId) {
        Categories category = categoryRespository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setActive(false);
        categoryRespository.save(category);
        return true;
    }

    @Override
    public CategoryResponseDTO updateCategory(Long categoryId, UpdateCategoryRequestDTO request) {
        Categories category = categoryRespository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Nếu đổi tên thì check trùng
        if (!category.getCategoryName().equals(request.getCategoryName())) {
            categoryRespository.findByCategoryName(request.getCategoryName())
                    .ifPresent(c -> {
                        throw new RuntimeException("Category name already exists");
                    });
        }

        category.setCategoryName(request.getCategoryName());
        category.setCategoryDescription(request.getCategoryDescription());

        Categories updated = categoryRespository.save(category);

        return categoryMapper.toResponseDTO(updated);
    }
}

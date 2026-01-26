package com.library.lmsproject.service.impl;


import com.library.lmsproject.dto.request.CreateCategoryRequestDTO;
import com.library.lmsproject.dto.request.UpdateCategoryRequestDTO;
import com.library.lmsproject.dto.response.CategoryResponseDTO;
import com.library.lmsproject.entity.Categories;
import com.library.lmsproject.mapper.CategoryMapper;
import com.library.lmsproject.repository.CategoryRepository;
import com.library.lmsproject.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    @Transactional
    @Override
    public CategoryResponseDTO createCategory(CreateCategoryRequestDTO request) {
        categoryRepository.findByCategoryName(request.getCategoryName())
                .ifPresent(c -> {
                    throw new RuntimeException("Category already exists");
                });
        Categories category = categoryMapper.toEntity(request);

        Categories savedCategory = categoryRepository.save(category);

        return categoryMapper.toResponseDTO(savedCategory);
    }

    @Override
    public Page<CategoryResponseDTO> getAllCategories(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Categories> categoriesPage;
        if (keyword != null && !keyword.isBlank()) {
            categoriesPage = categoryRepository.searchActiveCategories(keyword, pageable);
        } else {
            categoriesPage = categoryRepository.findByIsActive(true, pageable);
        }
        return categoriesPage.map(categoryMapper::toResponseDTO);
    }
    @Transactional
    @Override
    public Boolean deleteCategory(Long categoryId) {
        Categories category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Gỡ quan hệ many-to-many (xóa category_book)
        category.getBooks().forEach(book ->
                book.getCategories().remove(category)
        );
        category.getBooks().clear();

        // XÓA CỨNG CATEGORY
        categoryRepository.delete(category);

        return true;
    }
    @Transactional
    @Override
    public CategoryResponseDTO updateCategory(Long categoryId, UpdateCategoryRequestDTO request) {
        Categories category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));


        if (!category.getCategoryName().equals(request.getCategoryName())) {
            categoryRepository.findByCategoryName(request.getCategoryName())
                    .ifPresent(c -> {
                        throw new RuntimeException("Category name already exists");
                    });
        }

        category.setCategoryName(request.getCategoryName());
        category.setCategoryDescription(request.getCategoryDescription());

        Categories updated = categoryRepository.save(category);

        return categoryMapper.toResponseDTO(updated);
    }

    @Override
    public CategoryResponseDTO getCategoryById(Long categoryId) {

        Categories category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return categoryMapper.toResponseDTO(category);
    }
}

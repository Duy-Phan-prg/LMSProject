package com.Library.lmsproject.controller;


import com.Library.lmsproject.dto.request.CreateCategoryRequestDTO;
import com.Library.lmsproject.dto.request.UpdateCategoryRequestDTO;
import com.Library.lmsproject.dto.response.BookResponseDTO;
import com.Library.lmsproject.dto.response.CategoryResponseDTO;
import com.Library.lmsproject.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    //create category
    @PostMapping("/create")
    public ResponseEntity<CategoryResponseDTO> createCategory(
            @RequestBody CreateCategoryRequestDTO request) {

        return ResponseEntity.ok(categoryService.createCategory(request));
    }

    //GetAll category
    @GetMapping("/getAllCategories")
    public ResponseEntity<Page<CategoryResponseDTO>> getAllCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(
                categoryService.getAllCategories(page, size, keyword)
        );
    }

    //delete category
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id){
        boolean deleted = categoryService.deleteCategory(id);
        if(deleted){
            return ResponseEntity.ok("Book with ID " + id + " has been deactivated.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //Update category
    @PutMapping("/update/{id}")
    public CategoryResponseDTO updateCategory(
            @PathVariable Long id,
            @RequestBody @Valid UpdateCategoryRequestDTO request
    ) {
        return categoryService.updateCategory(id, request);
    }
}

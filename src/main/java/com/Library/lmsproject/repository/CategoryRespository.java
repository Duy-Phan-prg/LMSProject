package com.Library.lmsproject.repository;

import com.Library.lmsproject.entity.Books;
import com.Library.lmsproject.entity.Categories;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CategoryRespository extends JpaRepository<Categories, Long> {
    Optional<Categories> findByCategoryName(String categoryName);

    Page<Categories> findByIsActive(boolean isActive, Pageable pageable);

    @Query("""
        SELECT c FROM Categories c
        WHERE c.isActive = true
          AND LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    Page<Categories> searchActiveCategories(String keyword, Pageable pageable);
}

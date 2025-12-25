package com.Library.lmsproject.repository;

import com.Library.lmsproject.entity.Books;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;


public interface BookRepository extends JpaRepository<Books, Long> {
    Optional<Books> findByBookIdAndIsActive(Long bookId, boolean  isActive);

    Page<Books> findByIsActive(boolean isActive, Pageable pageable);
    boolean existsByIsbn(String isbn);

    @Query("""
        SELECT b FROM Books b
        WHERE b.isActive = true
        AND (
            LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
         OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
    """)
    Page<Books> searchActiveBooks(
            @Param("keyword") String keyword,
            Pageable pageable
    );




}

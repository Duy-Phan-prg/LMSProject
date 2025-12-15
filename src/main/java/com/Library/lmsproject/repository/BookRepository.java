package com.Library.lmsproject.repository;

import com.Library.lmsproject.entity.Books;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface BookRepository extends JpaRepository<Books, Long> {
    Optional<Books> findByBookIdAndIsActive(Long bookId, boolean  isActive);

}

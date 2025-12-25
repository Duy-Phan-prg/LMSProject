package com.Library.lmsproject.service.impl;

import com.Library.lmsproject.dto.request.CreateBookRequestDTO;
import com.Library.lmsproject.dto.request.UpdateBookRequestDTO;
import com.Library.lmsproject.dto.response.BookResponseDTO;
import com.Library.lmsproject.entity.Books;
import com.Library.lmsproject.entity.Categories;
import com.Library.lmsproject.mapper.BookMapper;
import com.Library.lmsproject.repository.BookRepository;
import com.Library.lmsproject.repository.CategoryRespository;
import com.Library.lmsproject.service.BookService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;
    private final CategoryRespository categoryRespository;

    @Transactional
    @Override
    public BookResponseDTO createBook(CreateBookRequestDTO request) {

        if (request.getCategoryIds() == null || request.getCategoryIds().isEmpty()) {
            throw new RuntimeException("Category is required");
        }

        Set<Categories> categories = new HashSet<>(
                categoryRespository.findAllById(request.getCategoryIds())
        );

        if (categories.size() != request.getCategoryIds().size()) {
            throw new RuntimeException("One or more categories not found");
        }

        Books book = bookMapper.toEntity(request);
        book.setIsActive(true);
        book.setCopiesAvailable(request.getCopiesTotal());
        book.setCategories(categories);
        book.setUpdatedAt(null);
        Books savedBook = bookRepository.save(book);

        return bookMapper.toResponseDTO(savedBook);
    }

    @Override
    public Page<BookResponseDTO> getAllBooks(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Books> booksPage;

        if (keyword != null && !keyword.isBlank()) {
            booksPage = bookRepository.searchActiveBooks(keyword, pageable);
        } else {
            booksPage = bookRepository.findByIsActive(true, pageable);
        }

        return booksPage.map(bookMapper::toResponseDTO);
    }
    @Transactional
    @Override
    public BookResponseDTO updateBook(Long bookId, UpdateBookRequestDTO request) {
        Books book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (request.getCategoryIds() != null) {

            if (request.getCategoryIds().isEmpty()) {
                throw new RuntimeException("Category list cannot be empty");
            }

            Set<Categories> categories = new HashSet<>(
                    categoryRespository.findAllById(request.getCategoryIds())
            );

            if (categories.size() != request.getCategoryIds().size()) {
                throw new RuntimeException("One or more categories not found");
            }

            book.setCategories(categories);

            if (!book.getIsActive()) {
                book.setIsActive(true);
            }
        }

        bookMapper.updateBookFromDto(request, book);

        if (request.getCopiesTotal() < book.getCopiesAvailable()) {
            book.setCopiesAvailable(request.getCopiesTotal());
        }

        return bookMapper.toResponseDTO(book);
    }

    @Transactional
    @Override
    public Boolean deleteBook(Long bookId) {
        Books book = bookRepository
                .findByBookIdAndIsActive(bookId, true)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // 1️⃣ XÓA LIÊN KẾT book_category
        book.getCategories().clear();

        // 2️⃣ SOFT DELETE BOOK
        book.setIsActive(false);

        return true;
    }
}


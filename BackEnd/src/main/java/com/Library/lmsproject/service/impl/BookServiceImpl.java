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

    @Override
    public BookResponseDTO createBook(CreateBookRequestDTO request) {

        Books book = bookMapper.toEntity(request);
        book.setIsActive(true);
        book.setCopiesAvailable(request.getCopiesTotal());

        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            Set<Categories> categories =
                    new HashSet<>(categoryRespository.findAllById(request.getCategoryIds()));

            book.setCategories(categories);
        }

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

    @Override
    public BookResponseDTO updateBook(Long bookId, UpdateBookRequestDTO request) {
        Books book = bookRepository
                .findByBookIdAndIsActive(bookId, true)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        bookMapper.updateBookFromDto(request, book);

        // logic nghiệp vụ
        if (request.getCopiesTotal() < book.getCopiesAvailable()) {
            book.setCopiesAvailable(request.getCopiesTotal());
        }

        Books savedBook = bookRepository.save(book);

        return bookMapper.toResponseDTO(savedBook);
    }

    @Override
    public Boolean deleteBook(Long bookId) {
        return bookRepository.findByBookIdAndIsActive(bookId, true)
                .map(book -> {
                    book.setIsActive(false);
                    bookRepository.save(book);
                    return true;
                })
                .orElseThrow(() -> new RuntimeException("Book not found"));
    }
}

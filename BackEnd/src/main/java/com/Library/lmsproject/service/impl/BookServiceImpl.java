package com.library.lmsproject.service.impl;

import com.library.lmsproject.dto.request.CreateBookRequestDTO;
import com.library.lmsproject.dto.request.UpdateBookRequestDTO;
import com.library.lmsproject.dto.response.BookResponseDTO;
import com.library.lmsproject.entity.Books;
import com.library.lmsproject.entity.Categories;
import com.library.lmsproject.mapper.BookMapper;
import com.library.lmsproject.repository.BookRepository;
import com.library.lmsproject.repository.CategoryRepository;
import com.library.lmsproject.service.BookService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;
    private final CategoryRepository categoryRepository;

    @Transactional
    @Override
    public BookResponseDTO createBook(CreateBookRequestDTO request) {

        if (request.getYearPublished() != null && request.getYearPublished() > Year.now().getValue()) {
            throw new RuntimeException("Năm xuất bản không được lớn hơn năm hiện tại");
        }


        if (bookRepository.existsByIsbn(request.getIsbn())) {
            throw new RuntimeException("ISBN already exists");
        }

        Set<Categories> categories = new HashSet<>(
                categoryRepository.findAllById(request.getCategoryIds())
        );

        if (categories.size() != request.getCategoryIds().size()) {
            throw new RuntimeException("One or more categories not found");
        }

        Books book = bookMapper.toEntity(request);
        book.setIsActive(true);
        book.setUpdatedAt(null);
        book.setCopiesAvailable(request.getCopiesTotal());
        book.setCategories(categories);

        int copiesTotal = request.getCopiesTotal();
        Integer copiesAvailableRequest = request.getCopiesAvailable();

        int copiesAvailable;
        if (copiesAvailableRequest == null) {
            copiesAvailable = copiesTotal;
        } else {
            if (copiesAvailableRequest < 0 || copiesAvailableRequest > copiesTotal) {
                throw new RuntimeException("copiesAvailable must be between 0 and copiesTotal");
            }
            copiesAvailable = copiesAvailableRequest;
        }

        book.setCopiesTotal(copiesTotal);
        book.setCopiesAvailable(copiesAvailable);

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

        if (request.getYearPublished() != null) {
            int currentYear = Year.now().getValue();
            if (request.getYearPublished() > currentYear) {
                throw new RuntimeException("Năm xuất bản không được lớn hơn năm hiện tại");
            }
        }

        if (request.getIsbn() != null &&
                !request.getIsbn().equals(book.getIsbn()) &&
                bookRepository.existsByIsbn(request.getIsbn())) {
            throw new RuntimeException("ISBN already exists");
        }

        if (request.getCategoryIds() != null) {
            Set<Categories> categories = new HashSet<>(
                    categoryRepository.findAllById(request.getCategoryIds())
            );

            if (categories.size() != request.getCategoryIds().size()) {
                throw new RuntimeException("One or more categories not found");
            }

            book.setCategories(categories);
            book.setIsActive(true);
        }


        if (request.getCopiesTotal() != null) {
            int oldTotal = book.getCopiesTotal();
            int oldAvailable = book.getCopiesAvailable();
            int borrowed = oldTotal - oldAvailable;

            int newTotal = request.getCopiesTotal();

            if (newTotal < borrowed) {
                throw new RuntimeException(
                        "copiesTotal cannot be less than borrowed books (" + borrowed + ")"
                );
            }

            book.setCopiesTotal(newTotal);
            book.setCopiesAvailable(newTotal - borrowed);
        }


        bookMapper.updateBookFromDto(request, book);

        return bookMapper.toResponseDTO(book);
    }

    @Transactional
    @Override
    public Boolean deleteBook(Long bookId) {

        Books book = bookRepository
                .findByBookIdAndIsActive(bookId, true)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        //owning side
        //Nên chỉ cần 1 dòng này là xóa liên kết rồi
        book.getCategories().clear();

        book.setIsActive(false);

        return true;
    }

    @Override
    public BookResponseDTO getBookById(Long id) {
        Books book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        return bookMapper.toResponseDTO(book);
    }
}

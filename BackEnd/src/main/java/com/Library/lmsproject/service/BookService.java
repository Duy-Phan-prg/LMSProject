package com.library.lmsproject.service;

import com.library.lmsproject.dto.request.CreateBookRequestDTO;
import com.library.lmsproject.dto.request.UpdateBookRequestDTO;
import com.library.lmsproject.dto.response.BookResponseDTO;
import org.springframework.data.domain.Page;

public interface BookService {

    BookResponseDTO createBook(CreateBookRequestDTO createBookRequestDTO);

    Page<BookResponseDTO> getAllBooks(int page, int size, String keyword);

    BookResponseDTO updateBook(Long bookId, UpdateBookRequestDTO request);

    Boolean deleteBook(Long id);

    BookResponseDTO getBookById(Long id);
}

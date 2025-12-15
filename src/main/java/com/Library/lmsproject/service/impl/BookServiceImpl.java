package com.Library.lmsproject.service.impl;

import com.Library.lmsproject.dto.request.CreateBookRequestDTO;
import com.Library.lmsproject.dto.response.BookResponseDTO;
import com.Library.lmsproject.entity.Books;
import com.Library.lmsproject.mapper.BookMapper;
import com.Library.lmsproject.repository.BookRepository;
import com.Library.lmsproject.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;

    @Override
    public BookResponseDTO createBook(CreateBookRequestDTO request) {
        // 1️⃣ Check
        // 2️⃣ Map Request DTO → Entity
        // 3️⃣ Xử lý nghiệp vụ
        // 4️⃣ Save DB
        // 5️⃣ Map Entity → Response DTO

        Books book = bookMapper.toEntity(request);
        book.setActive(true);
        book.setCopiesAvailable(request.getCopiesTotal());

        Books savedBook = bookRepository.save(book);

        return bookMapper.toResponseDTO(savedBook);
    }
}

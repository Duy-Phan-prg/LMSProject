package com.Library.lmsproject.service;

import com.Library.lmsproject.dto.request.CreateBookRequestDTO;
import com.Library.lmsproject.dto.response.BookResponseDTO;

public interface BookService {

    BookResponseDTO createBook(CreateBookRequestDTO createBookRequestDTO);
}

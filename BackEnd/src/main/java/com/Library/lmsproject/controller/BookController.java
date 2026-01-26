package com.library.lmsproject.controller;


import com.library.lmsproject.dto.request.CreateBookRequestDTO;
import com.library.lmsproject.dto.request.UpdateBookRequestDTO;
import com.library.lmsproject.dto.response.BookResponseDTO;
import com.library.lmsproject.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @PostMapping("/create")
    public ResponseEntity<BookResponseDTO> createBook(
            @Valid @RequestBody CreateBookRequestDTO request)
    {
        BookResponseDTO response = bookService.createBook(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //xem danh sach

    @GetMapping("/getAllBooks")
    public ResponseEntity<Page<BookResponseDTO>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(
                bookService.getAllBooks(page, size, keyword)
        );
    }
    //cap nhat sach
    @PutMapping("/update/{id}")
        public ResponseEntity<BookResponseDTO> updateBook(@PathVariable Long id, @RequestBody @Valid UpdateBookRequestDTO request
    ) {
        return ResponseEntity.ok(
                bookService.updateBook(id, request)
        );
    }
    //xoa mem sach
    @DeleteMapping("/delete/{id}")
        public ResponseEntity<String> deleteBook(@PathVariable Long id) {
        Boolean deleted = bookService.deleteBook(id);
        if (deleted) {
            return ResponseEntity.ok("Book with ID " + id + " has been deactivated.");
        } else {
            return ResponseEntity.status(404).body("Book with ID " + id + " not found.");
        }
    }
    //xem chi tiet sach
    @GetMapping("/getBookById/{id}")
    public ResponseEntity<BookResponseDTO> getBookById(@PathVariable Long id) {
        BookResponseDTO response = bookService.getBookById(id);
        return ResponseEntity.ok(response);
    }

}

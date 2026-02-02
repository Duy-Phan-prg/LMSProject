package com.library.lmsproject.config;

import com.library.lmsproject.entity.Books;
import com.library.lmsproject.entity.Categories;
import com.library.lmsproject.entity.Roles;
import com.library.lmsproject.entity.Users;
import com.library.lmsproject.repository.BookRepository;
import com.library.lmsproject.repository.CategoryRepository;
import com.library.lmsproject.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private UsersRepository usersRepository;

    @Override
    public void run(String... args) {
        // ============ USERS ============
        if (usersRepository.count() == 0) {
            Users admin = new Users();
            admin.setEmail("admin@library.com");
            admin.setPassword("31072005Xy09@");
            admin.setFullName("System Administrator");
            admin.setPhone("0688684829");
            admin.setAddress("Library Head Office");
            admin.setRole(Roles.ADMIN);
            admin.setActive(true);

            Users lib1 = new Users();
            lib1.setEmail("librarian1@library.com");
            lib1.setPassword("Lib@12344444");
            lib1.setFullName("Nguyen Thu Thu");
            lib1.setPhone("0901000001");
            lib1.setAddress("Ho Chi Minh City");
            lib1.setRole(Roles.LIBRARIAN);
            lib1.setActive(true);

            Users lib2 = new Users();
            lib2.setEmail("librarian2@library.com");
            lib2.setPassword("Lib@123");
            lib2.setFullName("Tran Minh Quan");
            lib2.setPhone("0901000002");
            lib2.setAddress("Ha Noi");
            lib2.setRole(Roles.LIBRARIAN);
            lib2.setActive(true);

            Users m1 = new Users();
            m1.setEmail("gg@gmail.com");
            m1.setPassword("31072005Xy09@");
            m1.setFullName("Le Van A");
            m1.setPhone("0902000001");
            m1.setAddress("Da Nang");
            m1.setRole(Roles.MEMBER);
            m1.setActive(true);

            Users m2 = new Users();
            m2.setEmail("member2@library.com");
            m2.setPassword("User@123");
            m2.setFullName("Pham Thi B");
            m2.setPhone("0902000002");
            m2.setAddress("Can Tho");
            m2.setRole(Roles.MEMBER);
            m2.setActive(true);

            Users m3 = new Users();
            m3.setEmail("member3@library.com");
            m3.setPassword("User@123");
            m3.setFullName("Vo Minh C");
            m3.setPhone("0902000003");
            m3.setAddress("Binh Duong");
            m3.setRole(Roles.MEMBER);
            m3.setActive(true);

            Users m4 = new Users();
            m4.setEmail("member4@library.com");
            m4.setPassword("User@123");
            m4.setFullName("Hoang Gia D");
            m4.setPhone("0902000004");
            m4.setAddress("Dong Nai");
            m4.setRole(Roles.MEMBER);
            m4.setActive(true);

            Users m5 = new Users();
            m5.setEmail("member5@library.com");
            m5.setPassword("User@123");
            m5.setFullName("Nguyen Thi E");
            m5.setPhone("0902000005");
            m5.setAddress("Hue");
            m5.setRole(Roles.MEMBER);
            m5.setActive(true);

            Users m6 = new Users();
            m6.setEmail("member6@library.com");
            m6.setPassword("User@123");
            m6.setFullName("Tran Van F");
            m6.setPhone("0902000006");
            m6.setAddress("Quang Ngai");
            m6.setRole(Roles.MEMBER);
            m6.setActive(true);

            Users m7 = new Users();
            m7.setEmail("member7@library.com");
            m7.setPassword("User@123");
            m7.setFullName("Do Thi G");
            m7.setPhone("0902000007");
            m7.setAddress("Hai Phong");
            m7.setRole(Roles.MEMBER);
            m7.setActive(true);

            usersRepository.saveAll(
                    List.of(admin, lib1, lib2, m1, m2, m3, m4, m5, m6, m7)
            );

            System.out.println("✅ Seed USERS xong (10 users)");
        }

        if (bookRepository.count() > 0) return;
        // ================== CATEGORY ==================
        Categories literature = saveCategory("Văn học", "Tiểu thuyết – truyện ngắn");
        Categories economy    = saveCategory("Kinh tế", "Kinh doanh – tài chính");
        Categories psychology = saveCategory("Tâm lý", "Tâm lý học – kỹ năng sống");
        Categories science    = saveCategory("Khoa học", "Khoa học tự nhiên");
        Categories history    = saveCategory("Lịch sử", "Lịch sử Việt Nam & thế giới");
        Categories children   = saveCategory("Thiếu nhi", "Sách cho trẻ em");
        Categories education  = saveCategory("Giáo dục", "Giáo trình – học tập");
        Categories it         = saveCategory("CNTT", "Công nghệ thông tin");

        // ================== BOOKS ==================
        saveBooks(literature, List.of(
                book("Dế Mèn Phiêu Lưu Ký", "Tô Hoài"),
                book("Tắt Đèn", "Ngô Tất Tố"),
                book("Số Đỏ", "Vũ Trọng Phụng"),
                book("Chí Phèo", "Nam Cao"),
                book("Lão Hạc", "Nam Cao"),
                book("Truyện Kiều", "Nguyễn Du"),
                book("Chiếc Thuyền Ngoài Xa", "Nguyễn Minh Châu"),
                book("Vợ Nhặt", "Kim Lân"),
                book("Đất Rừng Phương Nam", "Đoàn Giỏi"),
                book("Những Ngôi Sao Xa Xôi", "Lê Minh Khuê")
        ));

        saveBooks(economy, List.of(
                book("Cha Giàu Cha Nghèo", "Robert Kiyosaki"),
                book("Tư Duy Nhanh Và Chậm", "Daniel Kahneman"),
                book("Người Giàu Có Nhất Thành Babylon", "George S. Clason"),
                book("Bí Mật Tư Duy Triệu Phú", "T. Harv Eker"),
                book("Dạy Con Làm Giàu", "Robert Kiyosaki"),
                book("Quốc Gia Khởi Nghiệp", "Dan Senor"),
                book("Từ Tốt Đến Vĩ Đại", "Jim Collins"),
                book("Chiến Lược Đại Dương Xanh", "W. Chan Kim"),
                book("Startup Nation", "Dan Senor"),
                book("Nghệ Thuật Đầu Tư Dhandho", "Mohnish Pabrai")
        ));

        saveBooks(psychology, List.of(
                book("Đắc Nhân Tâm", "Dale Carnegie"),
                book("Trí Tuệ Cảm Xúc", "Daniel Goleman"),
                book("Tư Duy Tích Cực", "Norman Vincent Peale"),
                book("Sức Mạnh Của Thói Quen", "Charles Duhigg"),
                book("7 Thói Quen Hiệu Quả", "Stephen Covey"),
                book("Bước Chậm Lại Giữa Thế Gian Vội Vã", "Hae Min"),
                book("Dám Bị Ghét", "Ichiro Kishimi"),
                book("Tâm Lý Học Hành Vi", "Dan Ariely"),
                book("Atomic Habits", "James Clear"),
                book("Flow", "Mihaly Csikszentmihalyi")
        ));

        saveBooks(science, List.of(
                book("Lược Sử Thời Gian", "Stephen Hawking"),
                book("Vũ Trụ Trong Vỏ Hạt Dẻ", "Stephen Hawking"),
                book("Nguồn Gốc Các Loài", "Charles Darwin"),
                book("Cosmos", "Carl Sagan"),
                book("Vật Lý Lượng Tử", "Richard Feynman"),
                book("Cấu Trúc Vũ Trụ", "Brian Greene"),
                book("Brief Answers to the Big Questions", "Stephen Hawking"),
                book("The Elegant Universe", "Brian Greene"),
                book("Astrophysics for People in a Hurry", "Neil Tyson"),
                book("The Selfish Gene", "Richard Dawkins")
        ));

        saveBooks(history, List.of(
                book("Việt Nam Sử Lược", "Trần Trọng Kim"),
                book("Đại Việt Sử Ký Toàn Thư", "Ngô Sĩ Liên"),
                book("Lịch Sử Thế Giới", "H. G. Wells"),
                book("Chiến Tranh Thế Giới Thứ Hai", "Antony Beevor"),
                book("Napoleon", "Andrew Roberts"),
                book("Sapiens", "Yuval Noah Harari"),
                book("Homo Deus", "Yuval Noah Harari"),
                book("Guns, Germs, and Steel", "Jared Diamond"),
                book("The Silk Roads", "Peter Frankopan"),
                book("A People's History", "Howard Zinn")
        ));

        saveBooks(children, List.of(
                book("Hoàng Tử Bé", "Antoine de Saint-Exupéry"),
                book("Không Gia Đình", "Hector Malot"),
                book("Harry Potter", "J.K. Rowling"),
                book("Matilda", "Roald Dahl"),
                book("Charlie and the Chocolate Factory", "Roald Dahl"),
                book("Winnie-the-Pooh", "A. A. Milne"),
                book("Peter Pan", "J. M. Barrie"),
                book("Alice in Wonderland", "Lewis Carroll"),
                book("Pinocchio", "Carlo Collodi"),
                book("The Gruffalo", "Julia Donaldson")
        ));

        saveBooks(education, List.of(
                book("Phương Pháp Học Đại Học", "Nhiều tác giả"),
                book("Kỹ Năng Tư Duy Phản Biện", "Richard Paul"),
                book("Mindset", "Carol Dweck"),
                book("Learning How to Learn", "Barbara Oakley"),
                book("How We Learn", "Benedict Carey"),
                book("Teaching for Quality Learning", "John Biggs"),
                book("Bloom's Taxonomy", "Benjamin Bloom"),
                book("Study Skills", "Andrew Northedge"),
                book("The Art of Learning", "Josh Waitzkin"),
                book("Deep Work", "Cal Newport")
        ));

        saveBooks(it, List.of(
                book("Clean Code", "Robert C. Martin"),
                book("Effective Java", "Joshua Bloch"),
                book("Design Patterns", "GoF"),
                book("Refactoring", "Martin Fowler"),
                book("Spring in Action", "Craig Walls"),
                book("Head First Java", "Kathy Sierra"),
                book("The Pragmatic Programmer", "Andrew Hunt"),
                book("Code Complete", "Steve McConnell"),
                book("Introduction to Algorithms", "CLRS"),
                book("Computer Networks", "Tanenbaum")
        ));

        System.out.println("✅ Seed xong: mỗi category 10 quyển sách KHÁC NHAU");
    }

    // ================== HELPERS ==================
    private Categories saveCategory(String name, String desc) {
        Categories c = new Categories();
        c.setCategoryName(name);
        c.setCategoryDescription(desc);
        c.setActive(true);
        return categoryRepository.save(c);
    }

    private void saveBooks(Categories category, List<Books> books) {
        books.forEach(b -> {
            b.setIsbn(generateIsbn13());
            b.setPublisher("NXB Tổng Hợp");
            b.setYearPublished(2015 + new Random().nextInt(10));
            b.setPages(200 + new Random().nextInt(400));
            b.setLanguage("VI");
            b.setCopiesTotal(10);
            b.setCopiesAvailable(10);
            b.setIsActive(true);
            b.getCategories().add(category);
        });
        bookRepository.saveAll(books);
    }
    private String generateIsbn13() {
        Random random = new Random();

        // Prefix chuẩn ISBN
        String prefix = random.nextBoolean() ? "978" : "979";

        StringBuilder isbn = new StringBuilder(prefix);

        // Sinh 9 số tiếp theo (tổng 12 số)
        for (int i = 0; i < 9; i++) {
            isbn.append(random.nextInt(10));
        }

        // Tính checksum
        int sum = 0;
        for (int i = 0; i < 12; i++) {
            int digit = Character.getNumericValue(isbn.charAt(i));
            sum += (i % 2 == 0) ? digit : digit * 3;
        }

        int checksum = (10 - (sum % 10)) % 10;
        isbn.append(checksum);

        return isbn.toString();
    }

    private Books book(String title, String author) {
        Books b = new Books();
        b.setTitle(title);
        b.setAuthor(author);
        return b;
    }
}

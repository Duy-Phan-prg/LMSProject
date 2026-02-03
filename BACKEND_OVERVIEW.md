# Backend Project Overview - Library Management System

## 🏗️ Tech Stack

- **Framework**: Spring Boot 3.2.7
- **Java Version**: 17
- **Database**: SQL Server (LibraryManagementDB_2)
- **ORM**: Spring Data JPA (Hibernate)
- **Security**: Spring Security + JWT + OAuth2
- **API Documentation**: Swagger/OpenAPI 3
- **Mapping**: MapStruct 1.5.5
- **Build Tool**: Maven
- **Additional**: Lombok, Kotlin support

## 📦 Project Structure

```
BackEnd/src/main/java/com/Library/lmsproject/
├── config/              # Configuration classes
│   ├── DataInitializer.java
│   ├── OpenApiConfig.java
│   ├── PasswordEncoderConfig.java
│   └── SecurityConfig.java
│
├── controller/          # REST API Controllers
│   ├── BookController.java
│   ├── BorrowingController.java
│   ├── CategoryController.java
│   ├── ReviewController.java
│   ├── ReviewReportController.java
│   └── UserController.java
│
├── dto/                 # Data Transfer Objects
│   ├── request/         # Request DTOs
│   └── response/        # Response DTOs
│
├── entity/              # JPA Entities
│   ├── Users.java
│   ├── Books.java
│   ├── Borrowings.java
│   ├── Categories.java
│   ├── Review.java
│   ├── ReviewReport.java
│   ├── UserSession.java
│   ├── BlacklistedToken.java
│   └── Enums (Roles, BorrowStatus, etc.)
│
├── exception/           # Exception Handling
│   └── GlobalExceptionHandler.java
│
├── mapper/              # MapStruct Mappers
│   ├── BookMapper.java
│   ├── BorrowMapper.java
│   ├── CategoryMapper.java
│   ├── ReviewMapper.java
│   ├── ReviewReportMapper.java
│   └── UserMapper.java
│
├── repository/          # JPA Repositories
│   ├── BookRepository.java
│   ├── BorrowingRepository.java
│   ├── CategoryRepository.java
│   ├── ReviewRepository.java
│   ├── ReviewReportRepository.java
│   ├── UsersRepository.java
│   ├── UserSessionRepository.java
│   └── BlacklistRepository.java
│
├── security/            # Security Components
│   ├── CustomUserDetails.java
│   ├── CustomUserDetailsService.java
│   ├── JwtAuthenticationFilter.java
│   ├── JwtTokenProvider.java
│   ├── OAuth2SuccessHandler.java
│   └── RestAuthenticationEntryPoint.java
│
├── service/             # Business Logic
│   ├── impl/            # Service Implementations
│   ├── BookService.java
│   ├── BorrowingService.java
│   ├── CategoryService.java
│   ├── ReviewService.java
│   ├── ReviewReportService.java
│   └── UserService.java
│
└── lmsProjectApplication.java  # Main Application
```

## 📊 Database Schema

### Core Entities

#### 1. Users
```java
- id (PK)
- email (unique)
- password (nullable for OAuth2)
- fullName
- role (ADMIN, LIBRARIAN, MEMBER)
- isOauth2User (boolean)
- provider (GOOGLE)
- providerId
- phone
- address
- avatar
- refreshToken
- isActive
- createdAt, updatedAt
```

#### 2. Books
```java
- bookId (PK)
- isbn
- title
- author
- publisher
- yearPublished
- pages
- language
- description
- imageCover
- copiesTotal (tổng số sách)
- copiesAvailable (số sách có sẵn)
- isActive
- createdAt, updatedAt
- categories (Many-to-Many)
```

#### 3. Borrowings
```java
- borrowingId (PK)
- user (FK)
- book (FK)
- status (PENDING, APPROVED, PICKED_UP, RETURNED, CANCELLED, EXPIRED_PICKUP)
- requestAt
- pickupAt
- dueDate
- returnedAt
- overdueDays
- fineAmount
- message
```

#### 4. Categories
```java
- categoryId (PK)
- categoryName (unique)
- categoryDescription
- isActive
- books (Many-to-Many)
```

#### 5. Review
```java
- reviewId (PK)
- user (FK)
- book (FK)
- rating
- comment
- isDeleted
- hidden
- isEdited
- createdAt, updatedAt
```

#### 6. UserSession
```java
- sessionId (PK)
- sessionToken (unique)
- tokenType (ACCESS | REFRESH)
- isActive
- loginTime
- logoutTime
- user (FK)
```

#### 7. BlacklistedToken
```java
- id (PK)
- token
- expiryDate
```

## 🔐 Security & Authentication

### JWT Configuration
- **Access Token**: 15 minutes expiration
- **Refresh Token**: 7 days expiration
- **Secret Key**: 256-bit key
- **Algorithm**: HMAC SHA

### OAuth2 Configuration
- **Provider**: Google
- **Client ID**: 204638644064-2cjnrt0nol4b2bqqumph2cf7l2pmij5b.apps.googleusercontent.com
- **Scopes**: email, profile
- **Callback**: Handled by OAuth2SuccessHandler

### Security Flow
1. User login → Generate JWT tokens
2. Store tokens in UserSession table
3. Each request → JwtAuthenticationFilter validates token
4. Token expired → Use refresh token
5. Logout → Blacklist token

## 🌐 API Endpoints

### User Management (`/api/user`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/login` | Traditional login | Public |
| POST | `/register` | Register new user | Public |
| POST | `/refresh-token` | Refresh access token | Public |
| GET | `/me` | Get current user info | Required |
| GET | `/google-login` | Initiate Google OAuth2 | Public |
| POST | `/logout` | Logout user | Required |
| GET | `/getAllUsers` | Get all users (paginated) | Admin |
| POST | `/create` | Create user | Admin |
| PUT | `/update/{id}` | Update user | Admin |
| DELETE | `/delete/{id}` | Soft delete user | Admin |
| GET | `/getUserById/{id}` | Get user by ID | Admin |

### Book Management (`/api/books`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/create` | Create book | Librarian |
| GET | `/getAllBooks` | Get all books (paginated) | Public |
| PUT | `/update/{id}` | Update book | Librarian |
| DELETE | `/delete/{id}` | Soft delete book | Librarian |
| GET | `/getBookById/{id}` | Get book details | Public |

### Borrowing Management (`/api/borrowings`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/create` | Create borrow request | Member |
| GET | `/me` | Get my borrowings | Member |
| PUT | `/{id}/cancel` | Cancel borrow request | Member |
| GET | `/getAll` | Get all borrowings | Librarian |
| GET | `/getBorrowingDetails/{id}` | Get borrow details | Librarian |
| PUT | `/{id}/pickup` | Mark as picked up | Librarian |
| PUT | `/borrowings/{id}/status` | Update status | Librarian |

### Category Management (`/api/categories`)
- CRUD operations for categories
- Public read access
- Admin/Librarian write access

### Review Management (`/api/reviews`)
- Create, read, update, delete reviews
- Rating system (1-5 stars)
- Comment moderation

### Review Report Management (`/api/review-reports`)
- Report inappropriate reviews
- Admin moderation

## 🔄 Business Logic

### Borrowing Flow
1. **PENDING**: User creates borrow request
2. **APPROVED**: Librarian approves (auto-approved in current implementation)
3. **PICKED_UP**: Librarian marks as picked up, sets due date
4. **RETURNED**: User returns book, librarian confirms
5. **CANCELLED**: User cancels before pickup
6. **EXPIRED_PICKUP**: User doesn't pick up within time limit

### Book Availability
- `copiesTotal`: Total books in library
- `copiesAvailable`: Books available for borrowing
- When borrowed: `copiesAvailable--`
- When returned: `copiesAvailable++`

### User Roles
- **ADMIN**: Full system access
- **LIBRARIAN**: Manage books, borrowings, categories
- **MEMBER**: Browse books, create borrow requests, write reviews

## 🛠️ Key Features

### 1. Authentication
- Traditional email/password login
- Google OAuth2 login
- JWT token-based authentication
- Refresh token mechanism
- Token blacklisting on logout

### 2. Book Management
- CRUD operations
- Multi-category support
- Image cover support
- Inventory tracking
- Soft delete

### 3. Borrowing System
- Request-based borrowing
- Status tracking
- Due date management
- Overdue calculation
- Fine calculation
- Pickup confirmation

### 4. Review System
- Rating (1-5 stars)
- Comments
- Edit tracking
- Soft delete
- Hide/unhide by admin
- Report system

### 5. Search & Filter
- Keyword search for books
- Filter by category
- Filter by status
- Pagination support

## 📝 Configuration

### Database Connection
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=LibraryManagementDB_2
spring.datasource.username=sa
spring.datasource.password=12345
spring.jpa.hibernate.ddl-auto=update
```

### Server Configuration
```properties
server.port=8080 (default)
spring.jpa.show-sql=true
```

### CORS Configuration
- Allows all origins (development)
- Allows credentials
- Exposed headers: Authorization, Content-Type

## 🧪 Testing

### Swagger UI
- URL: `http://localhost:8080/swagger-ui.html`
- Interactive API documentation
- Test endpoints directly

### Test Endpoints
- All endpoints accessible via Swagger
- Authentication required for protected endpoints
- Use Bearer token in Authorization header

## 🚀 Running the Application

### Prerequisites
- Java 17+
- Maven 3.6+
- SQL Server
- Database: LibraryManagementDB_2

### Steps
```bash
cd BackEnd
mvn clean install
mvn spring-boot:run
```

### Access Points
- API: `http://localhost:8080/api`
- Swagger: `http://localhost:8080/swagger-ui.html`
- H2 Console: Not configured (using SQL Server)

## 📊 Data Flow

### User Login Flow
```
User → POST /api/user/login
  ↓
UserService.login()
  ↓
Validate credentials
  ↓
Generate JWT tokens
  ↓
Save to UserSession
  ↓
Return tokens to user
```

### Google OAuth2 Flow
```
User → GET /api/user/google-login
  ↓
Redirect to Google
  ↓
Google authenticates
  ↓
OAuth2SuccessHandler
  ↓
Create/Update user
  ↓
Generate JWT tokens
  ↓
Redirect to frontend with tokens
```

### Borrow Book Flow
```
User → POST /api/borrowings/create
  ↓
BorrowingService.borrowBook()
  ↓
Check book availability
  ↓
Create borrowing (PENDING)
  ↓
Auto-approve (APPROVED)
  ↓
Decrease copiesAvailable
  ↓
Return borrowing details
```

## 🔧 Maintenance

### Database Migrations
- Using `spring.jpa.hibernate.ddl-auto=update`
- Auto-creates/updates tables
- For production: Use Flyway/Liquibase

### Logging
- Spring Boot default logging
- SQL queries logged (`spring.jpa.show-sql=true`)

### Error Handling
- GlobalExceptionHandler
- Custom error responses
- Validation errors

## 📚 Dependencies Summary

| Dependency | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.2.7 | Framework |
| Spring Security | 3.2.7 | Authentication |
| Spring Data JPA | 3.2.7 | Database access |
| JWT | 0.12.3 | Token generation |
| MapStruct | 1.5.5 | Object mapping |
| Lombok | Latest | Boilerplate reduction |
| Swagger | 2.5.0 | API documentation |
| SQL Server JDBC | 12.6.1 | Database driver |
| OAuth2 Client | 3.2.7 | Google login |

## 🎯 Best Practices Implemented

1. **Layered Architecture**: Controller → Service → Repository
2. **DTO Pattern**: Separate request/response objects
3. **MapStruct**: Type-safe object mapping
4. **Validation**: Jakarta Validation annotations
5. **Exception Handling**: Centralized error handling
6. **Security**: JWT + OAuth2 + Role-based access
7. **Soft Delete**: Preserve data integrity
8. **Pagination**: Efficient data retrieval
9. **Indexing**: Database performance optimization
10. **API Documentation**: Swagger/OpenAPI

## 🔒 Security Considerations

- Passwords hashed with BCrypt
- JWT tokens with expiration
- Refresh token rotation
- Token blacklisting on logout
- CORS configuration
- SQL injection prevention (JPA)
- XSS prevention (validation)
- CSRF disabled (stateless API)

## 📈 Future Enhancements

- Email notifications
- File upload for book covers
- Advanced search (Elasticsearch)
- Caching (Redis)
- Rate limiting
- API versioning
- Microservices architecture
- Event-driven architecture
- Real-time notifications (WebSocket)
- Analytics dashboard

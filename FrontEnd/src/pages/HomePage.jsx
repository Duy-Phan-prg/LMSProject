import { useState, useEffect, useRef } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, ArrowRight, BookOpen, Users, Award, 
  User, Calendar, Star, ChevronLeft, ChevronRight,
  Clock, Zap, Shield, Headphones, Eye, TrendingUp,
  Gift, Truck
} from "lucide-react";
import { getAllCategories } from "../services/categoryService";
import "../styles/home.css";

// Mock books data (sau này thay bằng API)
const mockBooks = [
  // Văn học
  { bookId: 1, title: "Đắc Nhân Tâm", author: "Dale Carnegie", categoryId: 1, imageCover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop", copiesAvailable: 5, yearPublished: 2020 },
  { bookId: 2, title: "Nhà Giả Kim", author: "Paulo Coelho", categoryId: 1, imageCover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop", copiesAvailable: 3, yearPublished: 2019 },
  { bookId: 3, title: "Tuổi Trẻ Đáng Giá Bao Nhiêu", author: "Rosie Nguyễn", categoryId: 1, imageCover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop", copiesAvailable: 0, yearPublished: 2021 },
  { bookId: 4, title: "Cho Tôi Xin Một Vé Đi Tuổi Thơ", author: "Nguyễn Nhật Ánh", categoryId: 1, imageCover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=400&fit=crop", copiesAvailable: 7, yearPublished: 2018 },
  { bookId: 5, title: "Mắt Biếc", author: "Nguyễn Nhật Ánh", categoryId: 1, imageCover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=400&fit=crop", copiesAvailable: 2, yearPublished: 2019 },
  { bookId: 6, title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh", author: "Nguyễn Nhật Ánh", categoryId: 1, imageCover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=400&fit=crop", copiesAvailable: 4, yearPublished: 2020 },
  { bookId: 7, title: "Dế Mèn Phiêu Lưu Ký", author: "Tô Hoài", categoryId: 1, imageCover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=400&fit=crop", copiesAvailable: 6, yearPublished: 2017 },
  // Kinh tế
  { bookId: 8, title: "Cha Giàu Cha Nghèo", author: "Robert Kiyosaki", categoryId: 2, imageCover: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop", copiesAvailable: 4, yearPublished: 2020 },
  { bookId: 9, title: "Nghĩ Giàu Làm Giàu", author: "Napoleon Hill", categoryId: 2, imageCover: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=400&fit=crop", copiesAvailable: 2, yearPublished: 2019 },
  { bookId: 10, title: "Người Giàu Có Nhất Thành Babylon", author: "George S. Clason", categoryId: 2, imageCover: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&h=400&fit=crop", copiesAvailable: 5, yearPublished: 2021 },
  { bookId: 11, title: "Bí Mật Tư Duy Triệu Phú", author: "T. Harv Eker", categoryId: 2, imageCover: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=400&fit=crop", copiesAvailable: 3, yearPublished: 2020 },
  { bookId: 12, title: "Tâm Lý Học Về Tiền", author: "Morgan Housel", categoryId: 2, imageCover: "https://images.unsplash.com/photo-1565373679580-fc0cb538f49d?w=300&h=400&fit=crop", copiesAvailable: 0, yearPublished: 2022 },
  { bookId: 13, title: "Khởi Nghiệp Tinh Gọn", author: "Eric Ries", categoryId: 2, imageCover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=400&fit=crop", copiesAvailable: 4, yearPublished: 2019 },
  // Kỹ năng sống
  { bookId: 14, title: "7 Thói Quen Hiệu Quả", author: "Stephen Covey", categoryId: 3, imageCover: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=300&h=400&fit=crop", copiesAvailable: 6, yearPublished: 2020 },
  { bookId: 15, title: "Đời Ngắn Đừng Ngủ Dài", author: "Robin Sharma", categoryId: 3, imageCover: "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=300&h=400&fit=crop", copiesAvailable: 3, yearPublished: 2019 },
  { bookId: 16, title: "Sức Mạnh Của Thói Quen", author: "Charles Duhigg", categoryId: 3, imageCover: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=400&fit=crop", copiesAvailable: 5, yearPublished: 2021 },
  { bookId: 17, title: "Tư Duy Nhanh Và Chậm", author: "Daniel Kahneman", categoryId: 3, imageCover: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=400&fit=crop", copiesAvailable: 2, yearPublished: 2020 },
  { bookId: 18, title: "Atomic Habits", author: "James Clear", categoryId: 3, imageCover: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=400&fit=crop", copiesAvailable: 8, yearPublished: 2022 },
  // Khoa học
  { bookId: 19, title: "Lược Sử Thời Gian", author: "Stephen Hawking", categoryId: 4, imageCover: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&h=400&fit=crop", copiesAvailable: 4, yearPublished: 2018 },
  { bookId: 20, title: "Sapiens: Lược Sử Loài Người", author: "Yuval Noah Harari", categoryId: 4, imageCover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop", copiesAvailable: 6, yearPublished: 2020 },
  { bookId: 21, title: "Cosmos", author: "Carl Sagan", categoryId: 4, imageCover: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&h=400&fit=crop", copiesAvailable: 3, yearPublished: 2019 },
  { bookId: 22, title: "Gen Ích Kỷ", author: "Richard Dawkins", categoryId: 4, imageCover: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=300&h=400&fit=crop", copiesAvailable: 2, yearPublished: 2021 },
  { bookId: 23, title: "Vũ Trụ Trong Vỏ Hạt Dẻ", author: "Stephen Hawking", categoryId: 4, imageCover: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=400&fit=crop", copiesAvailable: 5, yearPublished: 2020 },
  // Thiếu nhi
  { bookId: 24, title: "Harry Potter", author: "J.K. Rowling", categoryId: 5, imageCover: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=300&h=400&fit=crop", copiesAvailable: 10, yearPublished: 2020 },
  { bookId: 25, title: "Hoàng Tử Bé", author: "Antoine de Saint-Exupéry", categoryId: 5, imageCover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop", copiesAvailable: 7, yearPublished: 2019 },
  { bookId: 26, title: "Doraemon", author: "Fujiko F. Fujio", categoryId: 5, imageCover: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=300&h=400&fit=crop", copiesAvailable: 15, yearPublished: 2021 },
  { bookId: 27, title: "Conan", author: "Gosho Aoyama", categoryId: 5, imageCover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop", copiesAvailable: 12, yearPublished: 2022 },
  { bookId: 28, title: "Shin - Cậu Bé Bút Chì", author: "Yoshito Usui", categoryId: 5, imageCover: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=300&h=400&fit=crop", copiesAvailable: 8, yearPublished: 2020 },
];

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [books] = useState(mockBooks);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const categoryRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories(0, 100);
      const activeCategories = response.content?.filter(c => c.active) || [];
      setCategories(activeCategories);
      if (activeCategories.length > 0) {
        setActiveTab(activeCategories[0].categoryId);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToCategory = (categoryId) => {
    setActiveTab(categoryId);
    const element = categoryRefs.current[categoryId];
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const features = [
    { icon: <Zap size={28} />, title: "Truy cập nhanh", desc: "Tìm kiếm và mượn sách chỉ trong vài giây" },
    { icon: <Shield size={28} />, title: "An toàn & Bảo mật", desc: "Thông tin được bảo vệ với công nghệ mã hóa" },
    { icon: <Clock size={28} />, title: "24/7 Hỗ trợ", desc: "Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn" },
    { icon: <Headphones size={28} />, title: "Audiobook", desc: "Nghe sách mọi lúc mọi nơi" },
    { icon: <Truck size={28} />, title: "Giao sách tận nơi", desc: "Miễn phí giao sách cho đơn từ 200k" },
    { icon: <Gift size={28} />, title: "Ưu đãi thành viên", desc: "Tích điểm đổi quà, giảm giá độc quyền" },
  ];

  const getBooksByCategory = (categoryId) => {
    return books.filter(book => book.categoryId === categoryId);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-floating hero-floating-1"></div>
        <div className="hero-floating hero-floating-2"></div>
        <div className="hero-floating hero-floating-3"></div>
        <Container>
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Nền tảng thư viện số #1 Việt Nam</span>
            </div>
            <h1 className="hero-title">Khám Phá</h1>
            <span className="hero-title-highlight">Thế Giới Tri Thức</span>
            <p className="hero-description">
              Truy cập hàng nghìn đầu sách từ văn học, khoa học đến kinh doanh. 
              Mượn sách online, đọc mọi lúc mọi nơi với trải nghiệm hiện đại.
            </p>
            <div className="hero-buttons">
              <button className="btn-hero-primary" onClick={() => navigate("/books")}>
                Bắt đầu khám phá <ArrowRight size={18} />
              </button>
              <button className="btn-hero-secondary">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <Container>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon"><BookOpen size={28} /></div>
              <div className="stat-number">10K+</div>
              <div className="stat-label">Đầu sách</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon"><Users size={28} /></div>
              <div className="stat-number">5K+</div>
              <div className="stat-label">Độc giả</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon"><Award size={28} /></div>
              <div className="stat-number">50+</div>
              <div className="stat-label">Thể loại</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon"><TrendingUp size={28} /></div>
              <div className="stat-number">99%</div>
              <div className="stat-label">Hài lòng</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Book Sections by Category */}
      <section className="books-by-category-section">
        <Container>
          {/* Category Tabs Navigation */}
          {categories.length > 0 && (
            <div className="category-nav-tabs">
              {categories.map((cat) => (
                <button
                  key={cat.categoryId}
                  className={`category-nav-tab ${activeTab === cat.categoryId ? "active" : ""}`}
                  onClick={() => scrollToCategory(cat.categoryId)}
                >
                  {cat.categoryName}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <Spinner animation="border" variant="primary" />
              <p>Đang tải sách...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={48} />
              <h3>Chưa có danh mục nào</h3>
              <p>Vui lòng thêm danh mục trong trang quản trị</p>
            </div>
          ) : (
            categories.map((category) => (
              <div 
                key={category.categoryId}
                ref={el => categoryRefs.current[category.categoryId] = el}
              >
                <BookCategoryRow 
                  category={category}
                  books={getBooksByCategory(category.categoryId)}
                  navigate={navigate}
                />
              </div>
            ))
          )}
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <div className="text-center mb-5">
            <div className="section-badge" style={{display: 'inline-flex'}}>
              <Sparkles size={14} />
              Tại sao chọn chúng tôi
            </div>
            <h2 className="section-title">Trải Nghiệm Đọc Sách Hiện Đại</h2>
            <p className="section-subtitle">Những tính năng giúp bạn tiếp cận tri thức dễ dàng hơn</p>
          </div>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <div className="cta-content">
            <div className="cta-text">
              <h2>Sẵn sàng khám phá thế giới sách?</h2>
              <p>Đăng ký ngay hôm nay để nhận ưu đãi đặc biệt và truy cập hàng nghìn đầu sách miễn phí.</p>
            </div>
            <div className="cta-buttons">
              <button className="btn-cta-primary" onClick={() => navigate("/register")}>
                Đăng ký miễn phí <ArrowRight size={18} />
              </button>
              <button className="btn-cta-secondary" onClick={() => navigate("/about")}>
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

// Component hiển thị sách theo từng category (scroll ngang)
function BookCategoryRow({ category, books, navigate }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [books]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (books.length === 0) return null;

  const defaultCover = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop";

  return (
    <div className="book-category-row">
      <div className="category-row-header">
        <div className="category-row-title">
          <h3>{category.categoryName}</h3>
          <span className="book-count">{books.length} sách</span>
        </div>
        <a href={`/books?category=${category.categoryId}`} className="view-all-link">
          Xem tất cả <ArrowRight size={16} />
        </a>
      </div>

      <div className="book-slider-container">
        {canScrollLeft && (
          <button className="slider-btn slider-btn-left" onClick={() => scroll('left')}>
            <ChevronLeft size={24} />
          </button>
        )}
        
        <div className="book-slider" ref={scrollRef}>
          {books.map((book) => (
            <div 
              key={book.bookId} 
              className="book-slide-card"
              onClick={() => navigate(`/book/${book.bookId}`)}
            >
              <div className="book-slide-cover">
                <img
                  src={book.imageCover || defaultCover}
                  alt={book.title}
                  onError={(e) => { e.target.src = defaultCover; }}
                />
                <span className={`availability-badge ${book.copiesAvailable > 0 ? "available" : "unavailable"}`}>
                  {book.copiesAvailable > 0 ? "Còn sách" : "Hết sách"}
                </span>
                <div className="book-slide-overlay">
                  <button className="view-detail-btn">
                    <Eye size={16} /> Xem chi tiết
                  </button>
                </div>
              </div>
              <div className="book-slide-info">
                <h4 className="book-slide-title">{book.title}</h4>
                <p className="book-slide-author">
                  <User size={12} /> {book.author}
                </p>
                <div className="book-slide-meta">
                  <span className="book-rating">
                    <Star size={12} fill="currentColor" /> 4.5
                  </span>
                  <span className="book-year">
                    <Calendar size={12} /> {book.yearPublished}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button className="slider-btn slider-btn-right" onClick={() => scroll('right')}>
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}

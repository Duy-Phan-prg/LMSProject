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
import { getAllBooks } from "../services/bookService";
import "../styles/home.css";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const categoryRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch categories và books song song
        const [catResponse, bookResponse] = await Promise.all([
          getAllCategories(0, 100),
          getAllBooks(0, 100)
        ]);
        
        const activeCategories = catResponse.content?.filter(c => c.active) || [];
        setCategories(activeCategories);
        
        if (activeCategories.length > 0) {
          setActiveTab(activeCategories[0].categoryId);
        }
        
        // Lấy danh sách sách (chỉ lấy sách active)
        const books = bookResponse.content?.filter(b => b.active !== false) || [];
        setAllBooks(books);
        
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

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

  const getBooksForCategory = (categoryId) => {
    // Filter sách theo category - sách có thể có nhiều categories
    return allBooks.filter(book => {
      // Kiểm tra nếu book.categories là array của tên category
      if (book.categories && Array.isArray(book.categories)) {
        const category = categories.find(c => c.categoryId === categoryId);
        if (category) {
          return book.categories.includes(category.categoryName);
        }
      }
      // Kiểm tra nếu book.categoryIds là array của ID
      if (book.categoryIds && Array.isArray(book.categoryIds)) {
        return book.categoryIds.includes(categoryId);
      }
      return false;
    });
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
                  books={getBooksForCategory(category.categoryId)}
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

  const defaultCover = "https://placehold.co/300x400/1a2744/d4a853?text=No+Cover";
  
  const isValidImageUrl = (url) => {
    if (!url || url === "string" || url.trim() === "") return false;
    return url.startsWith("http://") || url.startsWith("https://");
  };

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
                  src={isValidImageUrl(book.imageCover) ? book.imageCover : defaultCover}
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

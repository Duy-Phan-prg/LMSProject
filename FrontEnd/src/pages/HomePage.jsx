import { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, ArrowRight, BookOpen, Users, Award, 
  LayoutGrid, User, Calendar, BookMarked, Star,
  Clock, Zap, Shield, Headphones, Eye, TrendingUp,
  Gift, Truck
} from "lucide-react";
import { getAllBooks } from "../services/bookService";
import { getAllCategories } from "../services/categoryService";
import "../styles/home.css";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, booksRes] = await Promise.all([
        getAllCategories(0, 100),
        getAllBooks(0, 50),
      ]);
      setCategories(categoriesRes.content?.filter((c) => c.active) || []);
      setBooks(booksRes.content?.filter((b) => b.active) || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = activeCategory === "all" 
    ? books 
    : books.filter(book => book.categories?.includes(
        categories.find(c => c.categoryId === activeCategory)?.categoryName
      ));

  const defaultCover = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop";

  const features = [
    { icon: <Zap size={28} />, title: "Truy cập nhanh", desc: "Tìm kiếm và mượn sách chỉ trong vài giây với hệ thống tối ưu" },
    { icon: <Shield size={28} />, title: "An toàn & Bảo mật", desc: "Thông tin cá nhân được bảo vệ với công nghệ mã hóa tiên tiến" },
    { icon: <Clock size={28} />, title: "24/7 Hỗ trợ", desc: "Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc mọi nơi" },
    { icon: <Headphones size={28} />, title: "Audiobook", desc: "Nghe sách mọi lúc mọi nơi với thư viện audiobook phong phú" },
    { icon: <Truck size={28} />, title: "Giao sách tận nơi", desc: "Miễn phí giao sách cho đơn hàng từ 200.000đ toàn quốc" },
    { icon: <Gift size={28} />, title: "Ưu đãi thành viên", desc: "Tích điểm đổi quà, giảm giá độc quyền cho thành viên VIP" },
  ];

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

      {/* Collection Section */}
      <section className="collection-section">
        <Container>
          <div className="section-header">
            <div>
              <div className="section-badge">
                <Sparkles size={14} />
                Khám phá
              </div>
              <h2 className="section-title">Bộ Sưu Tập Sách</h2>
              <p className="section-subtitle">Duyệt qua bộ sưu tập sách phong phú của chúng tôi</p>
            </div>
            <a href="/books" className="view-all-link">
              Xem tất cả <ArrowRight size={18} />
            </a>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs">
            <button 
              className={`category-tab ${activeCategory === "all" ? "active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              <span className="tab-icon"><LayoutGrid size={16} /></span>
              <span>Tất cả</span>
            </button>
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat.categoryId}
                className={`category-tab ${activeCategory === cat.categoryId ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.categoryId)}
              >
                <span>{cat.categoryName}</span>
              </button>
            ))}
          </div>

          {/* Books Grid */}
          {loading ? (
            <div className="loading-container">
              <Spinner animation="border" variant="primary" />
              <p>Đang tải sách...</p>
            </div>
          ) : (
            <div className="books-grid">
              {filteredBooks.slice(0, 10).map((book) => (
                <div key={book.bookId} className="book-card" onClick={() => navigate(`/book/${book.bookId}`)}>
                  <div className="book-cover-container">
                    <img
                      src={book.imageCover || defaultCover}
                      alt={book.title}
                      className="book-cover"
                      onError={(e) => { e.target.src = defaultCover; }}
                    />
                    <span className={`book-availability ${book.copiesAvailable > 0 ? "available" : "unavailable"}`}>
                      <BookMarked size={12} />
                      {book.copiesAvailable > 0 ? `${book.copiesAvailable} có sẵn` : "Hết sách"}
                    </span>
                    <div className="book-rating">
                      <Star size={14} fill="currentColor" /> 4.5
                    </div>
                    <div className="book-overlay">
                      <button className="book-overlay-btn"><Eye size={16} /> Xem chi tiết</button>
                    </div>
                  </div>
                  <div className="book-info">
                    {book.categories?.length > 0 && (
                      <div className="book-categories">
                        {book.categories.slice(0, 1).map((cat, idx) => (
                          <span key={idx} className="book-category-tag">{cat}</span>
                        ))}
                      </div>
                    )}
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author"><User size={14} />{book.author || "Không rõ tác giả"}</p>
                    <div className="book-meta">
                      <span className="book-year"><Calendar size={14} />{book.yearPublished || "N/A"}</span>
                      <span className="book-pages"><BookOpen size={14} />{book.pages || "N/A"} trang</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredBooks.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon"><BookOpen size={36} /></div>
              <h3>Không có sách</h3>
              <p>Không tìm thấy sách trong danh mục này</p>
            </div>
          )}
        </Container>
      </section>

      {/* Features Section - Moved below Collection */}
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

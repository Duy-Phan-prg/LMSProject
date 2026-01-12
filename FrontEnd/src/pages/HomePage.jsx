import { useState, useEffect, useRef } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, User, Star, 
  ChevronLeft, ChevronRight, Eye, Crown, Flame, Sparkles, ArrowRight
} from "lucide-react";
import { getAllCategories } from "../services/categoryService";
import { getAllBooks } from "../services/bookService";
import "../styles/home.css";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRankTab, setActiveRankTab] = useState("popular");
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [catResponse, bookResponse] = await Promise.all([
          getAllCategories(0, 100),
          getAllBooks(0, 100)
        ]);
        
        const activeCategories = catResponse.content?.filter(c => c.active) || [];
        setCategories(activeCategories);
        
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

  const rankTabs = [
    { id: "popular", label: "Đọc nhiều", icon: <Flame size={16} /> },
    { id: "newest", label: "Mới nhất", icon: <Sparkles size={16} /> },
    { id: "rating", label: "Đánh giá cao", icon: <Star size={16} /> },
  ];

  const getRankedBooks = () => {
    switch (activeRankTab) {
      case "newest":
        return [...allBooks].sort((a, b) => b.bookId - a.bookId).slice(0, 10);
      case "rating":
        return [...allBooks].slice(0, 10);
      default:
        return allBooks.slice(0, 10);
    }
  };

  const defaultCover = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&q=80";
  
  const isValidImageUrl = (url) => {
    if (!url || url === "string" || url.trim() === "") return false;
    return url.startsWith("http://") || url.startsWith("https://");
  };

  const getBooksForCategory = (categoryId) => {
    return allBooks.filter(book => {
      if (book.categories && Array.isArray(book.categories)) {
        const category = categories.find(c => c.categoryId === categoryId);
        if (category) {
          return book.categories.includes(category.categoryName);
        }
      }
      return false;
    });
  };

  // Featured books for hero banner
  const featuredBooks = allBooks.slice(0, 5);

  // Auto slide
  useEffect(() => {
    if (featuredBooks.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % featuredBooks.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredBooks.length]);

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-center">
          <Spinner animation="border" variant="warning" />
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-bg-image"></div>
        <div className="hero-overlay"></div>
        <Container>
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Khám Phá Kho Tàng<br/>Tri Thức Vô Tận</h1>
              <p className="hero-desc">
                Hàng nghìn đầu sách từ văn học, khoa học đến kinh doanh. 
                Mượn sách online, đọc mọi lúc mọi nơi.
              </p>
              <div className="hero-buttons">
                <button className="hero-btn primary" onClick={() => document.querySelector('.ranking-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  Khám phá ngay <ArrowRight size={18} />
                </button>
                <button className="hero-btn secondary" onClick={() => navigate("/register")}>
                  Đăng ký miễn phí
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Ranking Section */}
      <section className="ranking-section">
        <Container>
          <div className="section-header">
            <h2><Crown size={24} /> Bảng xếp hạng</h2>
            <div className="rank-tabs">
              {rankTabs.map(tab => (
                <button
                  key={tab.id}
                  className={`rank-tab ${activeRankTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveRankTab(tab.id)}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="books-grid">
            {getRankedBooks().map((book, idx) => (
              <div 
                key={book.bookId} 
                className="book-card"
                onClick={() => navigate(`/book/${book.bookId}`)}
              >
                {idx < 3 && <span className={`rank-badge rank-${idx + 1}`}>{idx + 1}</span>}
                <div className="book-cover">
                  <img
                    src={isValidImageUrl(book.imageCover) ? book.imageCover : defaultCover}
                    alt={book.title}
                    onError={(e) => { e.target.src = defaultCover; }}
                  />
                  {book.copiesAvailable === 0 && <span className="out-badge">Hết</span>}
                </div>
                <div className="book-info">
                  <h4>{book.title}</h4>
                  <p className="author">{book.author}</p>
                  <div className="book-meta">
                    <span><Star size={12} fill="#fbbf24" color="#fbbf24" /> 4.5</span>
                    <span><Eye size={12} /> {Math.floor(Math.random() * 500) + 100}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Category Sections */}
      {categories.map((category) => {
        const categoryBooks = getBooksForCategory(category.categoryId);
        if (categoryBooks.length === 0) return null;

        return (
          <section key={category.categoryId} className="category-section">
            <Container>
              <div className="section-header">
                <h2><Flame size={20} /> {category.categoryName}</h2>
                <a href={`/books?category=${category.categoryId}`} className="view-all">
                  Xem tất cả <ChevronRight size={16} />
                </a>
              </div>
              <BookSlider books={categoryBooks} navigate={navigate} />
            </Container>
          </section>
        );
      })}
    </div>
  );
}

function BookSlider({ books, navigate }) {
  const scrollRef = useRef(null);
  const defaultCover = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&q=80";
  
  const isValidImageUrl = (url) => {
    if (!url || url === "string" || url.trim() === "") return false;
    return url.startsWith("http://") || url.startsWith("https://");
  };

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="slider-container">
      <button className="slider-btn left" onClick={() => scroll('left')}><ChevronLeft size={20} /></button>
      <div className="slider-track" ref={scrollRef}>
        {books.map((book) => (
          <div key={book.bookId} className="slide-card" onClick={() => navigate(`/book/${book.bookId}`)}>
            <div className="slide-cover">
              <img
                src={isValidImageUrl(book.imageCover) ? book.imageCover : defaultCover}
                alt={book.title}
                onError={(e) => { e.target.src = defaultCover; }}
              />
              {book.copiesAvailable > 0 
                ? <span className="available-badge">Còn sách</span>
                : <span className="out-badge">Hết</span>
              }
            </div>
            <h4>{book.title}</h4>
            <p><User size={12} /> {book.author}</p>
          </div>
        ))}
      </div>
      <button className="slider-btn right" onClick={() => scroll('right')}><ChevronRight size={20} /></button>
    </div>
  );
}

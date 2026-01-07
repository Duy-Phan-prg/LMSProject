import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import {
  ArrowLeft, BookOpen, User, Calendar, Building2, Languages,
  FileText, Hash, Layers, CheckCircle, XCircle, ShoppingCart
} from "lucide-react";
import { getBookById } from "../services/bookService";
import { createBorrow } from "../services/borrowService";
import { isAuthenticated } from "../services/authService";
import Swal from "sweetalert2";
import "../styles/book-detail.css";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    fetchBookDetail();
  }, [id]);

  const fetchBookDetail = async () => {
    try {
      setLoading(true);
      const data = await getBookById(id);
      console.log("Book data from API:", data); // Debug log
      setBook(data);
    } catch (error) {
      console.error("Error fetching book:", error);
      Swal.fire("Lỗi!", "Không thể tải thông tin sách", "error");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!isAuthenticated()) {
      Swal.fire({
        title: "Chưa đăng nhập",
        text: "Vui lòng đăng nhập để mượn sách",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#d4a853",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: `/book/${id}` } });
        }
      });
      return;
    }

    if (book.copiesAvailable <= 0) {
      Swal.fire("Hết sách!", "Sách này hiện không còn bản nào để mượn", "warning");
      return;
    }

    setBorrowing(true);
    try {
      await createBorrow(book.bookId);
      
      Swal.fire({
        title: "Thành công!",
        text: "Yêu cầu mượn sách đã được gửi. Vui lòng đến thư viện để lấy sách.",
        icon: "success",
        confirmButtonColor: "#d4a853",
      });
      
      // Refresh lại thông tin sách
      fetchBookDetail();
    } catch (error) {
      console.error("Error borrowing book:", error);
      Swal.fire("Lỗi!", error.response?.data?.message || "Không thể mượn sách", "error");
    } finally {
      setBorrowing(false);
    }
  };

  const defaultCover = "https://placehold.co/400x600/1a2744/d4a853?text=No+Cover";
  
  const isValidImageUrl = (url) => {
    if (!url || url === "string" || url.trim() === "") return false;
    return url.startsWith("http://") || url.startsWith("https://");
  };

  if (loading) {
    return (
      <div className="book-detail-page">
        <Container>
          <div className="loading-container">
            <Spinner animation="border" variant="warning" />
            <p>Đang tải thông tin sách...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-detail-page">
        <Container>
          <div className="not-found">
            <BookOpen size={64} />
            <h2>Không tìm thấy sách</h2>
            <button className="btn-back" onClick={() => navigate("/")}>
              <ArrowLeft size={18} /> Về trang chủ
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="book-detail-page">
      <Container>
        {/* Back Button */}
        <button className="btn-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Quay lại
        </button>

        <div className="book-detail-content">
          {/* Book Cover */}
          <div className="book-cover-section">
            <div className="book-cover-wrapper">
              <img
                src={isValidImageUrl(book.imageCover) ? book.imageCover : defaultCover}
                alt={book.title}
                onError={(e) => { e.target.src = defaultCover; }}
              />
              <span className={`availability-badge ${book.copiesAvailable > 0 ? "available" : "unavailable"}`}>
                {book.copiesAvailable > 0 ? "Còn sách" : "Hết sách"}
              </span>
            </div>
            
            {/* Borrow Button */}
            <button
              className={`btn-borrow ${book.copiesAvailable <= 0 ? "disabled" : ""}`}
              onClick={handleBorrow}
              disabled={borrowing || book.copiesAvailable <= 0}
            >
              {borrowing ? (
                <>
                  <Spinner size="sm" animation="border" /> Đang xử lý...
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  {book.copiesAvailable > 0 ? "Mượn sách" : "Hết sách"}
                </>
              )}
            </button>
            
            <p className="copies-info">
              Còn <strong>{book.copiesAvailable}</strong> / {book.copiesTotal} bản
            </p>
          </div>

          {/* Book Info */}
          <div className="book-info-section">
            <h1 className="book-title">{book.title}</h1>
            <p className="book-author">
              <User size={18} /> {book.author}
            </p>

            {/* Categories */}
            {book.categories && book.categories.length > 0 && (
              <div className="book-categories">
                {book.categories.map((cat, idx) => (
                  <span key={idx} className="category-tag">{cat}</span>
                ))}
              </div>
            )}

            {/* Meta Info */}
            <div className="book-meta-grid">
              <div className="meta-item">
                <Hash size={16} />
                <div>
                  <span className="meta-label">ISBN</span>
                  <span className="meta-value">{book.isbn || "N/A"}</span>
                </div>
              </div>
              <div className="meta-item">
                <Building2 size={16} />
                <div>
                  <span className="meta-label">Nhà xuất bản</span>
                  <span className="meta-value">{book.publisher || "N/A"}</span>
                </div>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <div>
                  <span className="meta-label">Năm xuất bản</span>
                  <span className="meta-value">{book.yearPublished || "N/A"}</span>
                </div>
              </div>
              <div className="meta-item">
                <FileText size={16} />
                <div>
                  <span className="meta-label">Số trang</span>
                  <span className="meta-value">{book.pages || "N/A"}</span>
                </div>
              </div>
              <div className="meta-item">
                <Languages size={16} />
                <div>
                  <span className="meta-label">Ngôn ngữ</span>
                  <span className="meta-value">{book.language || "N/A"}</span>
                </div>
              </div>
              <div className="meta-item">
                <Layers size={16} />
                <div>
                  <span className="meta-label">Số lượng</span>
                  <span className="meta-value">{book.copiesAvailable}/{book.copiesTotal}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {book.description && (
              <div className="book-description">
                <h3>Mô tả</h3>
                <p>{book.description}</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

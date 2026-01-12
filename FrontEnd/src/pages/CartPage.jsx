import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
  Bookmark, Trash2, BookOpen, ArrowLeft, ShoppingCart,
  Clock, XCircle, Calendar, AlertCircle
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { createBorrow, getMyBorrowings, cancelBorrow } from "../services/borrowService";
import { isAuthenticated } from "../services/authService";
import Swal from "sweetalert2";
import "../styles/cart.css";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [activeTab, setActiveTab] = useState("saved");
  const [pendingBorrows, setPendingBorrows] = useState([]);
  const [loadingBorrows, setLoadingBorrows] = useState(false);
  const [borrowingId, setBorrowingId] = useState(null);
  const navigate = useNavigate();

  const defaultCover = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&q=80";

  const isValidImageUrl = (url) => {
    if (!url || url === "string" || url.trim() === "") return false;
    return url.startsWith("http://") || url.startsWith("https://");
  };

  useEffect(() => {
    if (activeTab === "pending" && isAuthenticated()) {
      fetchPendingBorrows();
    }
  }, [activeTab]);

  const fetchPendingBorrows = async () => {
    setLoadingBorrows(true);
    try {
      const response = await getMyBorrowings("");
      const pending = (response.result || []).filter(
        b => b.status === "PENDING_PICKUP" || b.status === "ACTIVE"
      );
      setPendingBorrows(pending);
    } catch (error) {
      console.error("Error fetching borrows:", error);
    } finally {
      setLoadingBorrows(false);
    }
  };

  const handleBorrow = async (book) => {
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
          navigate("/login", { state: { from: "/cart" } });
        }
      });
      return;
    }

    setBorrowingId(book.bookId);
    try {
      await createBorrow(book.bookId);
      removeFromCart(book.bookId);
      
      // Tính ngày mai
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toLocaleDateString("vi-VN", { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'numeric', 
        year: 'numeric' 
      });
      
      Swal.fire({
        title: "Mượn sách thành công!",
        html: `
          <div style="text-align: left; line-height: 1.8;">
            <p><strong>📚 Sách:</strong> ${book.title}</p>
            <p><strong>📍 Địa điểm:</strong> Thư viện trường</p>
            <p><strong>📅 Ngày lấy:</strong> ${tomorrowStr}</p>
            <p><strong>⏰ Giờ lấy:</strong> 7h00 - 11h00 sáng</p>
            <hr style="border-color: rgba(0,0,0,0.1); margin: 12px 0;">
            <p style="color: #d97706; font-size: 0.9rem;">⚠️ Vui lòng đến đúng giờ để nhận sách</p>
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#d4a853",
        confirmButtonText: "Đã hiểu"
      });
      fetchPendingBorrows();
    } catch (error) {
      Swal.fire("Lỗi!", error.response?.data?.message || "Không thể mượn sách", "error");
    } finally {
      setBorrowingId(null);
    }
  };

  const handleCancelBorrow = async (borrow) => {
    const result = await Swal.fire({
      title: "Hủy yêu cầu?",
      text: `Hủy mượn sách "${borrow.bookTitle}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Hủy yêu cầu",
      cancelButtonText: "Đóng"
    });
    
    if (result.isConfirmed) {
      try {
        await cancelBorrow(borrow.borrowingId);
        Swal.fire("Đã hủy!", "", "success");
        fetchPendingBorrows();
      } catch (error) {
        Swal.fire("Lỗi!", error.response?.data?.message || "Không thể hủy", "error");
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  return (
    <div className="cart-page">
      <Container>
        <button className="btn-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Quay lại
        </button>

        <div className="cart-header">
          <h1><Bookmark size={28} /> Sách của tôi</h1>
        </div>

        {/* Tabs */}
        <div className="cart-tabs">
          <button 
            className={`cart-tab ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            <Bookmark size={18} /> Đã lưu ({cartItems.length})
          </button>
          <button 
            className={`cart-tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            <Clock size={18} /> Đang mượn ({pendingBorrows.length})
          </button>
        </div>

        {/* Tab: Sách đã lưu */}
        {activeTab === "saved" && (
          <>
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <Bookmark size={64} />
                <h3>Chưa lưu sách nào</h3>
                <p>Lưu sách để mượn sau</p>
                <button className="btn-browse" onClick={() => navigate("/")}>
                  Khám phá sách
                </button>
              </div>
            ) : (
              <>
                <div className="cart-list">
                  {cartItems.map((book) => (
                    <div key={book.bookId} className="cart-item">
                      <img
                        src={isValidImageUrl(book.imageCover) ? book.imageCover : defaultCover}
                        alt={book.title}
                        onClick={() => navigate(`/book/${book.bookId}`)}
                      />
                      <div className="cart-item-info">
                        <h4 onClick={() => navigate(`/book/${book.bookId}`)}>{book.title}</h4>
                        <p className="author">{book.author}</p>
                        <p className="availability">
                          {book.copiesAvailable > 0 
                            ? <span className="in-stock">Còn {book.copiesAvailable} sách</span>
                            : <span className="out-stock">Hết sách</span>
                          }
                        </p>
                      </div>
                      <div className="cart-item-actions">
                        <button 
                          className="btn-borrow-single"
                          onClick={() => handleBorrow(book)}
                          disabled={borrowingId === book.bookId || book.copiesAvailable <= 0}
                        >
                          {borrowingId === book.bookId ? "Đang xử lý..." : <><ShoppingCart size={16} /> Mượn</>}
                        </button>
                        <button className="btn-remove" onClick={() => removeFromCart(book.bookId)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {cartItems.length > 1 && (
                  <div className="cart-footer">
                    <button className="btn-clear" onClick={clearCart}>
                      Xóa tất cả
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Tab: Đang mượn */}
        {activeTab === "pending" && (
          <>
            {!isAuthenticated() ? (
              <div className="cart-empty">
                <AlertCircle size={64} />
                <h3>Chưa đăng nhập</h3>
                <p>Đăng nhập để xem sách đang mượn</p>
                <button className="btn-browse" onClick={() => navigate("/login")}>
                  Đăng nhập
                </button>
              </div>
            ) : loadingBorrows ? (
              <div className="cart-empty">
                <div className="spinner"></div>
                <p>Đang tải...</p>
              </div>
            ) : pendingBorrows.length === 0 ? (
              <div className="cart-empty">
                <Clock size={64} />
                <h3>Không có sách đang mượn</h3>
                <p>Sách bạn đang chờ lấy hoặc đang mượn sẽ hiển thị ở đây</p>
              </div>
            ) : (
              <div className="cart-list">
                {pendingBorrows.map((borrow) => (
                  <div key={borrow.borrowingId} className="cart-item pending-item">
                    <div className="pending-icon">
                      {borrow.status === "PENDING_PICKUP" ? <Clock size={24} /> : <BookOpen size={24} />}
                    </div>
                    <div className="cart-item-info">
                      <h4>{borrow.bookTitle}</h4>
                      <p className="status-text">
                        {borrow.status === "PENDING_PICKUP" ? "Chờ lấy sách" : "Đang mượn"}
                      </p>
                      <div className="borrow-dates">
                        <span><Calendar size={14} /> Yêu cầu: {formatDate(borrow.requestAt)}</span>
                        {borrow.dueDate && (
                          <span><Calendar size={14} /> Hạn trả: {formatDate(borrow.dueDate)}</span>
                        )}
                      </div>
                    </div>
                    <div className="pending-actions">
                      {borrow.status === "PENDING_PICKUP" && (
                        <button className="btn-cancel" onClick={() => handleCancelBorrow(borrow)}>
                          <XCircle size={18} /> Hủy
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

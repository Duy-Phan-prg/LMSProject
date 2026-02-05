import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import {
  ArrowLeft, BookOpen, User, Calendar, Building2, Languages,
  FileText, Hash, Layers, ShoppingCart, Star, Send, MessageSquare,
  Edit2, Trash2, X, Plus, Flag, AlertTriangle
} from "lucide-react";
import { getBookById } from "../services/bookService";
import { createBorrow } from "../services/borrowService";
import { getReviewsByBook, createReview, updateReview, deleteReview } from "../services/reviewService";
import { reportReview } from "../services/reportService";
import { isAuthenticated } from "../services/authService";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";
import "../styles/book-detail.css";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });
  
  const currentUserId = parseInt(localStorage.getItem("userId"));
  const { addToCart, isInCart, refreshPendingCount } = useCart();

  useEffect(() => {
    fetchBookDetail();
    fetchReviews();
  }, [id]);

  const fetchBookDetail = async () => {
    try {
      setLoading(true);
      const data = await getBookById(id);
      console.log("Book data from API:", data);
      setBook(data);
    } catch (error) {
      console.error("Error fetching book:", error);
      Swal.fire("Lỗi!", "Không thể tải thông tin sách", "error");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await getReviewsByBook(id);
      setReviews(data.result || data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      Swal.fire({
        title: "Chưa đăng nhập",
        text: "Vui lòng đăng nhập để viết đánh giá",
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

    if (!reviewForm.comment.trim()) {
      Swal.fire("Lỗi!", "Vui lòng nhập nội dung đánh giá", "warning");
      return;
    }

    setSubmittingReview(true);
    try {
      const userId = localStorage.getItem("userId");
      await createReview(userId, {
        bookId: parseInt(id),
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      
      Swal.fire("Thành công!", "Đánh giá của bạn đã được gửi", "success");
      setReviewForm({ rating: 5, comment: "" });
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      Swal.fire("Lỗi!", error.response?.data?.message || "Không thể gửi đánh giá", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review.reviewId);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditForm({ rating: 5, comment: "" });
  };

  const handleUpdateReview = async (reviewId) => {
    if (!editForm.comment.trim()) {
      Swal.fire("Lỗi!", "Vui lòng nhập nội dung đánh giá", "warning");
      return;
    }

    try {
      await updateReview(reviewId, currentUserId, {
        rating: editForm.rating,
        comment: editForm.comment
      });
      
      Swal.fire("Thành công!", "Đánh giá đã được cập nhật", "success");
      setEditingReview(null);
      setEditForm({ rating: 5, comment: "" });
      fetchReviews();
    } catch (error) {
      console.error("Error updating review:", error);
      Swal.fire("Lỗi!", error.response?.data?.message || "Không thể cập nhật đánh giá", "error");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: "Bạn có chắc muốn xóa đánh giá này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#ef4444",
    });

    if (result.isConfirmed) {
      try {
        await deleteReview(reviewId, currentUserId);
        Swal.fire("Đã xóa!", "Đánh giá đã được xóa", "success");
        fetchReviews();
      } catch (error) {
        console.error("Error deleting review:", error);
        Swal.fire("Lỗi!", error.response?.data?.message || "Không thể xóa đánh giá", "error");
      }
    }
  };

  const handleReportReview = async (review) => {
    const { value: formValues } = await Swal.fire({
      title: "Tố cáo đánh giá",
      html: `
        <div style="text-align: left;">
          <p style="margin-bottom: 12px;"><strong>Người đánh giá:</strong> ${review.userName}</p>
          <p style="margin-bottom: 12px;"><strong>Nội dung:</strong> "${review.comment}"</p>
          <hr style="margin: 16px 0; border-color: rgba(0,0,0,0.1);">
          <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Lý do tố cáo:</label>
          <select id="report-reason" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #d1d5db; margin-bottom: 16px; font-size: 14px; background: white; color: #374151;">
            <option value="">Chọn lý do tố cáo</option>
            <option value="spam">Spam hoặc quảng cáo</option>
            <option value="offensive">Ngôn từ xúc phạm, thô tục</option>
            <option value="fake">Đánh giá giả mạo</option>
            <option value="inappropriate">Nội dung không phù hợp</option>
            <option value="other">Lý do khác</option>
          </select>
          <div id="other-reason-container" style="display: none; margin-top: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Chi tiết lý do:</label>
            <textarea id="other-reason-text" placeholder="Vui lòng mô tả chi tiết lý do tố cáo..." style="width: 100%; min-height: 100px; padding: 10px 12px; border-radius: 8px; border: 1px solid #d1d5db; resize: vertical; font-size: 14px; font-family: inherit; line-height: 1.5;"></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Gửi tố cáo",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      width: '500px',
      didOpen: () => {
        const reasonSelect = document.getElementById('report-reason');
        const otherContainer = document.getElementById('other-reason-container');
        
        reasonSelect.addEventListener('change', (e) => {
          if (e.target.value === 'other') {
            otherContainer.style.display = 'block';
            // Focus vào textarea
            setTimeout(() => {
              document.getElementById('other-reason-text').focus();
            }, 100);
          } else {
            otherContainer.style.display = 'none';
          }
        });
      },
      preConfirm: () => {
        const reason = document.getElementById('report-reason').value;
        const otherText = document.getElementById('other-reason-text').value;
        
        if (!reason) {
          Swal.showValidationMessage('Vui lòng chọn lý do tố cáo!');
          return false;
        }
        
        if (reason === 'other' && !otherText.trim()) {
          Swal.showValidationMessage('Vui lòng nhập chi tiết lý do!');
          return false;
        }
        
        return { reason, otherText };
      }
    });

    if (formValues) {
      const reasonText = {
        spam: "Spam hoặc quảng cáo",
        offensive: "Ngôn từ xúc phạm, thô tục",
        fake: "Đánh giá giả mạo",
        inappropriate: "Nội dung không phù hợp",
        other: formValues.otherText
      };

      const finalReason = reasonText[formValues.reason];

      // Hiển thị loading
      Swal.fire({
        title: "Đang gửi tố cáo...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        await reportReview(review.reviewId, {
          reason: finalReason
        });

        Swal.fire({
          title: "Đã gửi tố cáo!",
          html: `
            <div style="text-align: left; line-height: 1.8;">
              <p><strong>Lý do:</strong> ${finalReason}</p>
              <p style="color: #64748b; font-size: 0.9rem; margin-top: 12px;">
                Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất.
              </p>
            </div>
          `,
          icon: "success",
          confirmButtonColor: "#d4a853"
        });
      } catch (error) {
        console.error("Error reporting review:", error);
        Swal.fire({
          title: "Lỗi!",
          text: error.response?.data?.message || "Không thể gửi tố cáo. Vui lòng thử lại sau.",
          icon: "error",
          confirmButtonColor: "#d4a853"
        });
      }
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

    // Hiển thị loading
    Swal.fire({
      title: "Đang mượn sách...",
      text: "Vui lòng đợi trong giây lát",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setBorrowing(true);
    try {
      await createBorrow(book.bookId);
      
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
            <hr style="border-color: rgba(0,0,0,0.1); margin: 16px 0;">
            <div style="background: rgba(239, 68, 68, 0.1); padding: 12px; border-radius: 8px; border-left: 3px solid #ef4444;">
              <p style="color: #ef4444; font-weight: 600; margin-bottom: 8px;">⚠️ CHÍNH SÁCH PHẠT:</p>
              <ul style="margin: 0; padding-left: 20px; color: #dc2626; font-size: 0.9rem;">
                <li>Trả sách trễ: <strong>5.000đ/ngày</strong></li>
                <li>Quá hạn trên 3 ngày: <strong>Khóa tài khoản</strong></li>
              </ul>
            </div>
            <p style="color: #d97706; font-size: 0.9rem; margin-top: 12px;">⏰ Vui lòng đến đúng giờ để nhận sách</p>
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#d4a853",
        confirmButtonText: "Đã hiểu"
      });
      
      // Refresh lại thông tin sách và pending count
      fetchBookDetail();
      refreshPendingCount();
    } catch (error) {
      console.error("Error borrowing book:", error);
      Swal.fire("Lỗi!", error.response?.data?.message || "Không thể mượn sách", "error");
    } finally {
      setBorrowing(false);
    }
  };

  const defaultCover = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&q=80";
  
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
                  {book.copiesAvailable > 0 ? "Mượn ngay" : "Hết sách"}
                </>
              )}
            </button>

            {/* Add to Cart Button */}
            <button
              className={`btn-add-cart ${isInCart(book.bookId) ? "in-cart" : ""}`}
              onClick={() => {
                // Check login trước
                if (!isAuthenticated()) {
                  Swal.fire({
                    title: "Chưa đăng nhập",
                    text: "Vui lòng đăng nhập để lưu sách",
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

                if (isInCart(book.bookId)) {
                  navigate("/cart");
                } else {
                  const added = addToCart(book);
                  if (added) {
                    Swal.fire({
                      title: "Đã thêm vào giỏ!",
                      text: book.title,
                      icon: "success",
                      timer: 1500,
                      showConfirmButton: false
                    });
                  }
                }
              }}
              disabled={book.copiesAvailable <= 0}
            >
              <Plus size={20} />
              {isInCart(book.bookId) ? "Đã trong giỏ" : "Thêm vào giỏ"}
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

        {/* Reviews Section */}
        <div className="reviews-section">
          <h3><MessageSquare size={24} /> Đánh giá ({reviews.length})</h3>
          
          {/* Review Form */}
          <div className="review-form-container">
            <h4>Viết đánh giá của bạn</h4>
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="rating-input">
                <label>Đánh giá:</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= reviewForm.rating ? "active" : ""}`}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    >
                      <Star size={24} fill={star <= reviewForm.rating ? "#d4a853" : "none"} />
                    </button>
                  ))}
                  <span className="rating-text">{reviewForm.rating}/5</span>
                </div>
              </div>
              <div className="comment-input">
                <textarea
                  placeholder="Chia sẻ cảm nhận của bạn về cuốn sách này..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows={4}
                />
              </div>
              <button type="submit" className="btn-submit-review" disabled={submittingReview}>
                {submittingReview ? (
                  <><Spinner size="sm" animation="border" /> Đang gửi...</>
                ) : (
                  <><Send size={18} /> Gửi đánh giá</>
                )}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <div className="no-reviews">
                <MessageSquare size={48} />
                <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.reviewId} className="review-item">
                  {editingReview === review.reviewId ? (
                    /* Edit Mode */
                    <div className="review-edit-form">
                      <div className="rating-input">
                        <label>Đánh giá:</label>
                        <div className="star-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className={`star-btn ${star <= editForm.rating ? "active" : ""}`}
                              onClick={() => setEditForm({ ...editForm, rating: star })}
                            >
                              <Star size={24} fill={star <= editForm.rating ? "#d4a853" : "none"} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={editForm.comment}
                        onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                        rows={3}
                        className="edit-textarea"
                      />
                      <div className="edit-actions">
                        <button 
                          className="btn-save-edit" 
                          onClick={() => handleUpdateReview(review.reviewId)}
                        >
                          Lưu
                        </button>
                        <button 
                          className="btn-cancel-edit" 
                          onClick={handleCancelEdit}
                        >
                          <X size={16} /> Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <>
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">
                            {review.userName?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <span className="reviewer-name">{review.userName}</span>
                            <span className="review-date">
                              {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </div>
                        <div className="review-header-right">
                          <div className="review-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                fill={star <= review.rating ? "#d4a853" : "none"}
                                color="#d4a853"
                              />
                            ))}
                          </div>
                          {review.userId === currentUserId ? (
                            <div className="review-actions">
                              <button 
                                className="btn-edit-review" 
                                onClick={() => handleEditReview(review)}
                                title="Chỉnh sửa"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                className="btn-delete-review" 
                                onClick={() => handleDeleteReview(review.reviewId)}
                                title="Xóa"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ) : (
                            isAuthenticated() && (
                              <div className="review-actions">
                                <button 
                                  className="btn-report-review" 
                                  onClick={() => handleReportReview(review)}
                                  title="Tố cáo vi phạm"
                                >
                                  <Flag size={16} />
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      {review.warningMessage && (
                        <div className="review-warning" style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 16px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '8px',
                          color: '#ef4444',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          marginBottom: '12px'
                        }}>
                          <AlertTriangle size={16} />
                          <span>{review.warningMessage}</span>
                        </div>
                      )}
                      <p className="review-comment">{review.comment}</p>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

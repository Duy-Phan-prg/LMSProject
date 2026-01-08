import { useState, useEffect } from "react";
import {
  MessageSquare, Search, Trash2, RefreshCw, AlertCircle,
  Star, User, BookOpen
} from "lucide-react";
import Swal from "sweetalert2";
import { getAllReviews, deleteReview } from "../../services/reviewService";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [filteredReviews, setFilteredReviews] = useState([]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getAllReviews();
      const reviewList = data.result || data || [];
      setReviews(reviewList);
      setFilteredReviews(reviewList);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      Swal.fire("Lỗi!", "Không thể tải danh sách đánh giá", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSearch = () => {
    const keyword = searchInput.toLowerCase().trim();
    if (!keyword) {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter(r => 
        r.userName?.toLowerCase().includes(keyword) ||
        r.comment?.toLowerCase().includes(keyword)
      ));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleDelete = async (reviewId, userName) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: `Bạn có chắc muốn xóa đánh giá của "${userName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy"
    });
    
    if (result.isConfirmed) {
      try {
        const adminId = localStorage.getItem("userId");
        await deleteReview(reviewId, adminId);
        Swal.fire("Thành công!", "Đã xóa đánh giá.", "success");
        fetchReviews();
      } catch (error) {
        console.error("Error deleting review:", error);
        Swal.fire("Lỗi!", error.response?.data?.message || "Không thể xóa đánh giá", "error");
      }
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="admin-page reviews-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><MessageSquare size={28} /></div>
          <div>
            <h1 className="page-title">Quản lý đánh giá</h1>
            <p className="page-subtitle">Xem và quản lý các đánh giá sách</p>
          </div>
        </div>
        <div className="page-header-right">
          <button className="btn-secondary" onClick={fetchReviews}>
            <RefreshCw size={18} /> Làm mới
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-icon blue"><MessageSquare size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{reviews.length}</span>
            <span className="stat-card-label">Tổng đánh giá</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon yellow"><Star size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{avgRating}</span>
            <span className="stat-card-label">Điểm trung bình</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <div className="search-input">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo tên người dùng hoặc nội dung..." 
              value={searchInput} 
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <button className="btn-secondary" onClick={handleSearch}>Tìm kiếm</button>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="table-container">
        {loading ? (
          <div className="table-loading"><div className="spinner"></div><p>Đang tải...</p></div>
        ) : filteredReviews.length === 0 ? (
          <div className="table-empty"><AlertCircle size={48} /><h3>Không có đánh giá</h3></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Người dùng</th>
                <th>Đánh giá</th>
                <th>Nội dung</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review.reviewId}>
                  <td>{review.reviewId}</td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-small">
                        {review.userName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <span>{review.userName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="rating-cell">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          fill={star <= review.rating ? "#d4a853" : "none"}
                          color="#d4a853"
                        />
                      ))}
                      <span className="rating-number">({review.rating})</span>
                    </div>
                  </td>
                  <td>
                    <div className="comment-cell" title={review.comment}>
                      {review.comment?.length > 50 
                        ? review.comment.substring(0, 50) + "..." 
                        : review.comment}
                    </div>
                  </td>
                  <td>{new Date(review.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="action-btn delete" 
                        onClick={() => handleDelete(review.reviewId, review.userName)}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { BookOpen, Clock, CheckCircle, AlertCircle, Calendar, Eye, X, XCircle, DollarSign } from "lucide-react";
import { getMyBorrowings, cancelBorrow } from "../services/borrowService";
import Swal from "sweetalert2";
import "../styles/profile.css";

export default function MyBorrowsPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [viewingBorrow, setViewingBorrow] = useState(null);

  useEffect(() => {
    fetchBorrows();
  }, [filter]);

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const response = await getMyBorrowings(filter);
      setBorrows(response.result || []);
    } catch (error) {
      console.error("Error fetching borrows:", error);
      Swal.fire("Lỗi!", "Không thể tải lịch sử mượn sách", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (borrow, index) => {
    const result = await Swal.fire({
      title: "Hủy yêu cầu mượn?",
      text: `Bạn có chắc muốn hủy yêu cầu mượn sách "${borrow.bookTitle}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Hủy yêu cầu",
      cancelButtonText: "Đóng"
    });
    
    if (result.isConfirmed) {
      try {
        await cancelBorrow(borrow.borrowingId || index);
        Swal.fire("Thành công!", "Đã hủy yêu cầu mượn sách", "success");
        fetchBorrows();
      } catch (error) {
        console.error("Error canceling borrow:", error);
        Swal.fire("Lỗi!", "Không thể hủy yêu cầu", "error");
      }
    }
  };

  const getStatusBadge = (status) => {
    const statuses = {
      PENDING_PICKUP: { class: "status-pending", label: "Chờ lấy sách", icon: <Clock size={14} /> },
      ACTIVE: { class: "status-active", label: "Đang mượn", icon: <BookOpen size={14} /> },
      RETURNED: { class: "status-returned", label: "Đã trả", icon: <CheckCircle size={14} /> },
      OVERDUE: { class: "status-overdue", label: "Quá hạn", icon: <AlertCircle size={14} /> },
      EXPIRED_PICKUP: { class: "status-expired", label: "Hết hạn lấy sách", icon: <XCircle size={14} /> },
      CANCELED: { class: "status-canceled", label: "Đã hủy", icon: <XCircle size={14} /> },
    };
    const s = statuses[status] || { class: "status-pending", label: status, icon: <Clock size={14} /> };
    return <span className={`borrow-status ${s.class}`}>{s.icon} {s.label}</span>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("vi-VN");
  };

  const stats = {
    total: borrows.length,
    pending: borrows.filter(b => b.status === "PENDING_PICKUP").length,
    active: borrows.filter(b => b.status === "ACTIVE").length,
    returned: borrows.filter(b => b.status === "RETURNED").length,
    overdue: borrows.filter(b => b.status === "OVERDUE").length,
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container wide">
        <div className="page-title-section">
          <BookOpen size={32} />
          <div>
            <h1>Lịch sử mượn sách</h1>
            <p>Theo dõi các sách bạn đã và đang mượn</p>
          </div>
        </div>

        <div className="borrow-stats">
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Tổng số</span>
          </div>
          <div className="stat-item pending">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Chờ lấy</span>
          </div>
          <div className="stat-item active">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">Đang mượn</span>
          </div>
          <div className="stat-item returned">
            <span className="stat-value">{stats.returned}</span>
            <span className="stat-label">Đã trả</span>
          </div>
        </div>

        <div className="borrow-filter">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING_PICKUP">Chờ lấy sách</option>
            <option value="ACTIVE">Đang mượn</option>
            <option value="OVERDUE">Quá hạn</option>
            <option value="RETURNED">Đã trả</option>
            <option value="EXPIRED_PICKUP">Hết hạn lấy sách</option>
            <option value="CANCELED">Đã hủy</option>
          </select>
        </div>

        {borrows.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={64} />
            <h3>Chưa có lịch sử mượn sách</h3>
            <p>Khi bạn mượn sách, lịch sử sẽ hiển thị ở đây</p>
          </div>
        ) : (
          <div className="borrow-list">
            {borrows.map((borrow, index) => (
              <div key={index} className="borrow-card">
                <div className="borrow-book-cover">
                  <BookOpen size={32} />
                </div>
                <div className="borrow-info">
                  <h4>{borrow.bookTitle}</h4>
                  <p className="borrow-status-msg">{borrow.statusMessage}</p>
                  <div className="borrow-dates">
                    <span><Calendar size={14} /> Yêu cầu: {formatDateTime(borrow.requestAt)}</span>
                    {borrow.dueDate && (
                      <span><Calendar size={14} /> Hạn trả: {formatDate(borrow.dueDate)}</span>
                    )}
                  </div>
                  {borrow.fineAmount > 0 && (
                    <div className="borrow-fine">
                      <DollarSign size={14} /> Phí phạt: {borrow.fineAmount.toLocaleString("vi-VN")}đ
                    </div>
                  )}
                </div>
                <div className="borrow-actions">
                  {getStatusBadge(borrow.status)}
                  <div className="borrow-btns">
                    <button className="btn-view" onClick={() => setViewingBorrow(borrow)}>
                      <Eye size={16} /> Chi tiết
                    </button>
                    {/* Cần backend trả về borrowingId để hủy được */}
                    {borrow.status === "PENDING_PICKUP" && borrow.id && (
                      <button className="btn-cancel-borrow" onClick={() => handleCancel(borrow)}>
                        <XCircle size={16} /> Hủy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewingBorrow && (
        <div className="modal-overlay" onClick={() => setViewingBorrow(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết mượn sách</h2>
              <button className="modal-close" onClick={() => setViewingBorrow(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Sách:</span>
                <span className="detail-value">{viewingBorrow.bookTitle}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Trạng thái:</span>
                <span className="detail-value">{getStatusBadge(viewingBorrow.status)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mô tả:</span>
                <span className="detail-value">{viewingBorrow.statusMessage || "—"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Ngày yêu cầu:</span>
                <span className="detail-value">{formatDateTime(viewingBorrow.requestAt)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Hạn trả:</span>
                <span className="detail-value">{formatDate(viewingBorrow.dueDate)}</span>
              </div>
              {viewingBorrow.fineAmount > 0 && (
                <div className="detail-row">
                  <span className="detail-label">Phí phạt:</span>
                  <span className="detail-value fine">{viewingBorrow.fineAmount.toLocaleString("vi-VN")}đ</span>
                </div>
              )}
              {viewingBorrow.message && (
                <div className="detail-row">
                  <span className="detail-label">Ghi chú:</span>
                  <span className="detail-value">{viewingBorrow.message}</span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setViewingBorrow(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

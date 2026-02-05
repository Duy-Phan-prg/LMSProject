import { useState, useEffect } from "react";
import { BookOpen, Clock, CheckCircle, AlertCircle, XCircle, Calendar, Star } from "lucide-react";
import { getMyBorrowings } from "../services/borrowService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/profile.css";

export default function MyBorrowsPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ACTIVE");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBorrows();
  }, [activeTab]);

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const status = activeTab === "ALL" ? "" : activeTab;
      const response = await getMyBorrowings(status);
      setBorrows(response.result || []);
    } catch (error) {
      console.error("Error fetching borrows:", error);
      Swal.fire("Lỗi!", "Không thể tải lịch sử mượn sách", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statuses = {
      PENDING_PICKUP: { class: "status-pending", label: "Chờ lấy sách", icon: <Clock size={14} /> },
      ACTIVE: { class: "status-active", label: "Đang mượn", icon: <BookOpen size={14} /> },
      RETURNED: { class: "status-returned", label: "Đã trả", icon: <CheckCircle size={14} /> },
      OVERDUE: { class: "status-overdue", label: "Quá hạn", icon: <AlertCircle size={14} /> },
      EXPIRED_PICKUP: { class: "status-expired", label: "Hết hạn lấy", icon: <XCircle size={14} /> },
      CANCELED: { class: "status-canceled", label: "Đã hủy", icon: <XCircle size={14} /> },
    };
    const s = statuses[status] || { class: "status-pending", label: status, icon: <Clock size={14} /> };
    return <span className={`borrow-status ${s.class}`}>{s.icon} {s.label}</span>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN");
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
            <p>Xem lại các sách bạn đã mượn</p>
          </div>
        </div>

        <div className="borrow-tabs">
          <button 
            className={`tab-btn ${activeTab === "ACTIVE" ? "active" : ""}`}
            onClick={() => setActiveTab("ACTIVE")}
          >
            <BookOpen size={18} /> Đang mượn
          </button>
          <button 
            className={`tab-btn ${activeTab === "PENDING_PICKUP" ? "active" : ""}`}
            onClick={() => setActiveTab("PENDING_PICKUP")}
          >
            <Clock size={18} /> Chờ lấy sách
          </button>
          <button 
            className={`tab-btn ${activeTab === "RETURNED" ? "active" : ""}`}
            onClick={() => setActiveTab("RETURNED")}
          >
            <CheckCircle size={18} /> Lịch sử đã trả
          </button>
          <button 
            className={`tab-btn ${activeTab === "ALL" ? "active" : ""}`}
            onClick={() => setActiveTab("ALL")}
          >
            <Calendar size={18} /> Tất cả
          </button>
        </div>

        {borrows.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={64} />
            <h3>Chưa có lịch sử</h3>
            <p>Khi bạn mượn sách, lịch sử sẽ hiển thị ở đây</p>
          </div>
        ) : (
          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>Tên sách</th>
                  <th>Ngày yêu cầu</th>
                  <th>Hạn trả</th>
                  <th>Trạng thái</th>
                  {activeTab === "RETURNED" && <th>Thao tác</th>}
                </tr>
              </thead>
              <tbody>
                {borrows.map((borrow, index) => (
                  <tr key={index}>
                    <td className="book-title-cell">{borrow.bookTitle}</td>
                    <td>{formatDate(borrow.requestAt)}</td>
                    <td>{formatDate(borrow.dueDate)}</td>
                    <td>{getStatusBadge(borrow.status)}</td>
                    {activeTab === "RETURNED" && (
                      <td>
                        <button 
                          className="btn-review"
                          onClick={() => navigate(`/books/${borrow.bookId}`)}
                        >
                          <Star size={14} /> Đánh giá
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

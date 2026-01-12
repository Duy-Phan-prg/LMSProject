import { useState, useEffect } from "react";
import { BookOpen, Clock, CheckCircle, AlertCircle, XCircle, Calendar } from "lucide-react";
import { getMyBorrowings } from "../services/borrowService";
import Swal from "sweetalert2";
import "../styles/profile.css";

export default function MyBorrowsPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

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

        <div className="borrow-filter">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Tất cả</option>
            <option value="PENDING_PICKUP">Chờ lấy sách</option>
            <option value="ACTIVE">Đang mượn</option>
            <option value="RETURNED">Đã trả</option>
            <option value="OVERDUE">Quá hạn</option>
            <option value="CANCELED">Đã hủy</option>
          </select>
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
                </tr>
              </thead>
              <tbody>
                {borrows.map((borrow, index) => (
                  <tr key={index}>
                    <td className="book-title-cell">{borrow.bookTitle}</td>
                    <td>{formatDate(borrow.requestAt)}</td>
                    <td>{formatDate(borrow.dueDate)}</td>
                    <td>{getStatusBadge(borrow.status)}</td>
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

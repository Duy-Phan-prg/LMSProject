import { useState, useEffect } from "react";
import {
  BookOpen, Search, Eye, ChevronLeft, ChevronRight,
  RefreshCw, AlertCircle, X, User, Calendar, Clock
} from "lucide-react";

export default function BorrowHistoryPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewingBorrow, setViewingBorrow] = useState(null);

  const fetchBorrows = async () => {
    // TODO: Gọi API lấy lịch sử mượn
    setLoading(true);
    try {
      // const data = await getAllBorrows(currentPage, pageSize);
      // setBorrows(data.content || []);
      setBorrows([]);
    } catch (error) {
      console.error("Error fetching borrows:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, [currentPage, pageSize]);

  const getStatusBadge = (status) => {
    const statuses = {
      PENDING: { class: "status-pending", label: "Chờ duyệt" },
      BORROWING: { class: "status-borrowing", label: "Đang mượn" },
      RETURNED: { class: "status-returned", label: "Đã trả" },
      OVERDUE: { class: "status-overdue", label: "Quá hạn" },
    };
    const s = statuses[status] || statuses.PENDING;
    return <span className={`status-badge ${s.class}`}>{s.label}</span>;
  };

  const filteredBorrows = borrows.filter(b => {
    const matchSearch = b.user?.fullName?.toLowerCase().includes(searchInput.toLowerCase()) ||
                       b.book?.title?.toLowerCase().includes(searchInput.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><BookOpen size={28} /></div>
          <div>
            <h1 className="page-title">Lịch sử mượn sách</h1>
            <p className="page-subtitle">Xem tất cả giao dịch mượn/trả (chỉ xem)</p>
          </div>
        </div>
        <div className="page-header-right">
          <button className="btn-secondary" onClick={fetchBorrows} disabled={loading}>
            <RefreshCw size={18} className={loading ? "spin" : ""} /> Làm mới
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-icon blue"><BookOpen size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{borrows.length}</span>
            <span className="stat-card-label">Tổng giao dịch</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon orange"><Clock size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{borrows.filter(b => b.status === "BORROWING").length}</span>
            <span className="stat-card-label">Đang mượn</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><BookOpen size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{borrows.filter(b => b.status === "RETURNED").length}</span>
            <span className="stat-card-label">Đã trả</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon red"><AlertCircle size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{borrows.filter(b => b.status === "OVERDUE").length}</span>
            <span className="stat-card-label">Quá hạn</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <div className="search-input">
            <Search size={18} />
            <input type="text" placeholder="Tìm theo tên người mượn, sách..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          </div>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="BORROWING">Đang mượn</option>
            <option value="RETURNED">Đã trả</option>
            <option value="OVERDUE">Quá hạn</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="table-loading"><div className="spinner"></div><p>Đang tải...</p></div>
        ) : filteredBorrows.length === 0 ? (
          <div className="table-empty">
            <AlertCircle size={48} />
            <h3>Chưa có lịch sử mượn sách</h3>
            <p style={{color: '#94a3b8'}}>Cần tích hợp API từ backend</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Người mượn</th>
                <th>Sách</th>
                <th>Ngày mượn</th>
                <th>Hạn trả</th>
                <th>Ngày trả</th>
                <th>Trạng thái</th>
                <th className="th-actions">Xem</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrows.map((borrow) => (
                <tr key={borrow.id}>
                  <td><strong>#{borrow.id}</strong></td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar"><span>{borrow.user?.fullName?.charAt(0)}</span></div>
                      <div className="user-info">
                        <span className="user-name">{borrow.user?.fullName}</span>
                        <span className="user-id">{borrow.user?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{borrow.book?.title}</td>
                  <td>{borrow.borrowDate ? new Date(borrow.borrowDate).toLocaleDateString("vi-VN") : "—"}</td>
                  <td>{borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString("vi-VN") : "—"}</td>
                  <td>{borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString("vi-VN") : "—"}</td>
                  <td>{getStatusBadge(borrow.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" onClick={() => setViewingBorrow(borrow)}><Eye size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Modal */}
      {viewingBorrow && (
        <div className="modal-overlay" onClick={() => setViewingBorrow(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết mượn sách #{viewingBorrow.id}</h2>
              <button className="modal-close" onClick={() => setViewingBorrow(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4><User size={16} /> Người mượn</h4>
                <p><strong>{viewingBorrow.user?.fullName}</strong></p>
                <p>{viewingBorrow.user?.email}</p>
              </div>
              <div className="detail-section">
                <h4><BookOpen size={16} /> Sách</h4>
                <p><strong>{viewingBorrow.book?.title}</strong></p>
                <p>{viewingBorrow.book?.author}</p>
              </div>
              <div className="detail-section">
                <h4><Calendar size={16} /> Thời gian</h4>
                <p>Ngày mượn: {viewingBorrow.borrowDate ? new Date(viewingBorrow.borrowDate).toLocaleDateString("vi-VN") : "—"}</p>
                <p>Hạn trả: {viewingBorrow.dueDate ? new Date(viewingBorrow.dueDate).toLocaleDateString("vi-VN") : "—"}</p>
                {viewingBorrow.returnDate && <p>Ngày trả: {new Date(viewingBorrow.returnDate).toLocaleDateString("vi-VN")}</p>}
              </div>
              <div className="detail-section">
                <h4>Trạng thái</h4>
                {getStatusBadge(viewingBorrow.status)}
              </div>
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

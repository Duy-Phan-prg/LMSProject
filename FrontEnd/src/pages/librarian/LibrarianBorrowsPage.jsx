import { useState, useEffect, useCallback } from "react";
import {
  ShoppingCart, Search, Eye, CheckCircle, XCircle, Clock,
  RefreshCw, AlertCircle, X, BookOpen, User, Calendar
} from "lucide-react";
import Swal from "sweetalert2";
import { getAllBorrowings } from "../../services/borrowService";

export default function LibrarianBorrowsPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewingBorrow, setViewingBorrow] = useState(null);

  const fetchBorrows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllBorrowings(filterStatus);
      setBorrows(data.result || []);
    } catch (error) {
      console.error("Error fetching borrows:", error);
      Swal.fire("Lỗi!", "Không thể tải danh sách mượn sách", "error");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchBorrows();
  }, [fetchBorrows]);

  const getStatusBadge = (status) => {
    const statuses = {
      PENDING_PICKUP: { class: "status-pending", label: "Chờ lấy sách", icon: <Clock size={14} /> },
      ACTIVE: { class: "status-borrowing", label: "Đang mượn", icon: <BookOpen size={14} /> },
      RETURNED: { class: "status-returned", label: "Đã trả", icon: <CheckCircle size={14} /> },
      OVERDUE: { class: "status-overdue", label: "Quá hạn", icon: <AlertCircle size={14} /> },
    };
    const s = statuses[status] || { class: "status-pending", label: status, icon: <Clock size={14} /> };
    return <span className={`status-badge ${s.class}`}>{s.icon} {s.label}</span>;
  };

  const handleApprove = async (borrow) => {
    const result = await Swal.fire({
      title: "Xác nhận cho mượn?",
      text: `Duyệt yêu cầu mượn sách "${borrow.bookTitle}" của ${borrow.userName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Duyệt",
      cancelButtonText: "Hủy"
    });
    if (result.isConfirmed) {
      // TODO: Gọi API khi backend sẵn sàng
      Swal.fire("Thông báo", "API duyệt chưa được implement ở backend", "info");
    }
  };

  const handleReject = async (borrow) => {
    const result = await Swal.fire({
      title: "Từ chối yêu cầu?",
      text: `Từ chối yêu cầu mượn sách "${borrow.bookTitle}" của ${borrow.userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Từ chối",
      cancelButtonText: "Hủy"
    });
    if (result.isConfirmed) {
      // TODO: Gọi API khi backend sẵn sàng
      Swal.fire("Thông báo", "API từ chối chưa được implement ở backend", "info");
    }
  };

  const handleReturn = async (borrow) => {
    const result = await Swal.fire({
      title: "Xác nhận trả sách?",
      text: `Xác nhận ${borrow.userName} đã trả sách "${borrow.bookTitle}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy"
    });
    if (result.isConfirmed) {
      // TODO: Gọi API khi backend sẵn sàng
      Swal.fire("Thông báo", "API trả sách chưa được implement ở backend", "info");
    }
  };

  const filteredBorrows = borrows.filter(b => {
    const matchSearch = b.userName?.toLowerCase().includes(searchInput.toLowerCase()) ||
                       b.bookTitle?.toLowerCase().includes(searchInput.toLowerCase());
    return matchSearch;
  });

  const stats = {
    total: borrows.length,
    pendingPickup: borrows.filter(b => b.status === "PENDING_PICKUP").length,
    active: borrows.filter(b => b.status === "ACTIVE").length,
    returned: borrows.filter(b => b.status === "RETURNED").length,
    overdue: borrows.filter(b => b.status === "OVERDUE").length,
  };

  return (
    <div className="admin-page borrows-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><ShoppingCart size={28} /></div>
          <div>
            <h1 className="page-title">Quản lý mượn/trả</h1>
            <p className="page-subtitle">Duyệt yêu cầu mượn và xác nhận trả sách</p>
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
          <div className="stat-card-icon blue"><ShoppingCart size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.total}</span>
            <span className="stat-card-label">Tổng yêu cầu</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon orange"><Clock size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.pendingPickup}</span>
            <span className="stat-card-label">Chờ lấy sách</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><BookOpen size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.active}</span>
            <span className="stat-card-label">Đang mượn</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon red"><AlertCircle size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.overdue}</span>
            <span className="stat-card-label">Quá hạn</span>
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
              placeholder="Tìm theo tên người mượn, sách..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <select className="filter-select" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); }}>
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING_PICKUP">Chờ lấy sách</option>
            <option value="ACTIVE">Đang mượn</option>
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
            <h3>Chưa có yêu cầu mượn sách</h3>
            <p style={{color: '#94a3b8'}}>Khi có người mượn sách, danh sách sẽ hiển thị ở đây</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Người mượn</th>
                <th>Sách</th>
                <th>Ngày yêu cầu</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
                <th className="th-actions">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrows.map((borrow, index) => (
                <tr key={index}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar"><span>{borrow.userName?.charAt(0)?.toUpperCase()}</span></div>
                      <div className="user-info">
                        <span className="user-name">{borrow.userName}</span>
                        <span className="user-id">ID: {borrow.userId}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="book-info-cell">
                      <span className="book-name">{borrow.bookTitle}</span>
                    </div>
                  </td>
                  <td className="date-cell">
                    {borrow.requestAt ? new Date(borrow.requestAt).toLocaleString("vi-VN") : "—"}
                  </td>
                  <td>{getStatusBadge(borrow.status)}</td>
                  <td style={{maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                    {borrow.message || "—"}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" title="Xem chi tiết" onClick={() => setViewingBorrow(borrow)}>
                        <Eye size={16} />
                      </button>
                      
                      {/* Chờ lấy sách -> Duyệt hoặc Từ chối */}
                      {borrow.status === "PENDING_PICKUP" && (
                        <>
                          <button className="action-btn edit" title="Duyệt cho mượn" onClick={() => handleApprove(borrow)}>
                            <CheckCircle size={16} />
                          </button>
                          <button className="action-btn delete" title="Từ chối" onClick={() => handleReject(borrow)}>
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      
                      {/* Đang mượn hoặc Quá hạn -> Xác nhận trả */}
                      {(borrow.status === "ACTIVE" || borrow.status === "OVERDUE") && (
                        <button className="action-btn edit" title="Xác nhận trả sách" onClick={() => handleReturn(borrow)}>
                          <CheckCircle size={16} />
                        </button>
                      )}
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
              <h2>Chi tiết yêu cầu mượn</h2>
              <button className="modal-close" onClick={() => setViewingBorrow(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4><User size={16} /> Người mượn</h4>
                <p><strong>{viewingBorrow.userName}</strong></p>
                <p>User ID: {viewingBorrow.userId}</p>
              </div>
              <div className="detail-section">
                <h4><BookOpen size={16} /> Sách</h4>
                <p><strong>{viewingBorrow.bookTitle}</strong></p>
              </div>
              <div className="detail-section">
                <h4><Calendar size={16} /> Thời gian</h4>
                <p>Ngày yêu cầu: {viewingBorrow.requestAt ? new Date(viewingBorrow.requestAt).toLocaleString("vi-VN") : "—"}</p>
              </div>
              <div className="detail-section">
                <h4>Trạng thái</h4>
                {getStatusBadge(viewingBorrow.status)}
              </div>
              {viewingBorrow.message && (
                <div className="detail-section">
                  <h4>Ghi chú</h4>
                  <p>{viewingBorrow.message}</p>
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

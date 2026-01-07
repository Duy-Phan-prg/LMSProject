import { useState, useEffect, useCallback } from "react";
import {
  ShoppingCart, Search, Eye, CheckCircle, XCircle, Clock,
  RefreshCw, AlertCircle, X, BookOpen, User, Calendar
} from "lucide-react";
import Swal from "sweetalert2";
import { getAllBorrowings, pickupBorrow, updateBorrowStatus } from "../../services/borrowService";

export default function LibrarianBorrowsPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewingBorrow, setViewingBorrow] = useState(null);
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });

  const fetchBorrows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllBorrowings({
        status: filterStatus,
        keyword: searchKeyword,
        page: pagination.page,
        size: pagination.size
      });
      setBorrows(data.content || []);
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0
      }));
    } catch (error) {
      console.error("Error fetching borrows:", error);
      Swal.fire("Lỗi!", "Không thể tải danh sách mượn sách", "error");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, searchKeyword, pagination.page, pagination.size]);

  useEffect(() => {
    fetchBorrows();
  }, [fetchBorrows]);

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 0 }));
    setSearchKeyword(searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const getStatusBadge = (status) => {
    const statuses = {
      PENDING_PICKUP: { class: "status-pending", label: "Chờ lấy sách", icon: <Clock size={14} /> },
      ACTIVE: { class: "status-borrowing", label: "Đang mượn", icon: <BookOpen size={14} /> },
      RETURNED: { class: "status-returned", label: "Đã trả", icon: <CheckCircle size={14} /> },
      OVERDUE: { class: "status-overdue", label: "Quá hạn", icon: <AlertCircle size={14} /> },
      EXPIRED_PICKUP: { class: "status-expired", label: "Hết hạn lấy", icon: <XCircle size={14} /> },
      CANCELED: { class: "status-canceled", label: "Đã hủy", icon: <XCircle size={14} /> },
    };
    const s = statuses[status] || { class: "status-pending", label: status, icon: <Clock size={14} /> };
    return <span className={`status-badge ${s.class}`}>{s.icon} {s.label}</span>;
  };

  const handleApprove = async (borrow) => {
    const { value: borrowDays } = await Swal.fire({
      title: "Giao sách cho người mượn",
      text: `Xác nhận giao sách "${borrow.bookTitle}" cho ${borrow.userName}?`,
      input: "number",
      inputLabel: "Số ngày mượn",
      inputValue: 14,
      inputAttributes: {
        min: 1,
        max: 60,
        step: 1
      },
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xác nhận giao sách",
      cancelButtonText: "Hủy",
      inputValidator: (value) => {
        if (!value || value < 1) {
          return "Vui lòng nhập số ngày mượn hợp lệ";
        }
      }
    });
    
    if (borrowDays) {
      try {
        await pickupBorrow(borrow.borrowingId, parseInt(borrowDays));
        Swal.fire("Thành công!", "Đã giao sách cho người mượn", "success");
        fetchBorrows();
      } catch (error) {
        console.error("Error pickup borrow:", error);
        Swal.fire("Lỗi!", error.response?.data?.message || "Không thể thực hiện thao tác", "error");
      }
    }
  };

  const handleReject = async (borrow) => {
    const result = await Swal.fire({
      title: "Hủy yêu cầu?",
      text: `Đánh dấu yêu cầu mượn sách "${borrow.bookTitle}" của ${borrow.userName} là hết hạn lấy sách?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy"
    });
    if (result.isConfirmed) {
      try {
        await updateBorrowStatus(borrow.borrowingId, "EXPIRED_PICKUP");
        Swal.fire("Thành công!", "Đã cập nhật trạng thái", "success");
        fetchBorrows();
      } catch (error) {
        console.error("Error update status:", error);
        Swal.fire("Lỗi!", "Không thể thực hiện thao tác", "error");
      }
    }
  };

  const handleReturn = async (borrow) => {
    const { value: status } = await Swal.fire({
      title: "Cập nhật trạng thái",
      text: `Cập nhật trạng thái cho "${borrow.bookTitle}" của ${borrow.userName}`,
      input: "select",
      inputOptions: {
        RETURNED: "Đã trả sách",
        EXPIRED_PICKUP: "Hết hạn lấy sách"
      },
      inputPlaceholder: "Chọn trạng thái",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      inputValidator: (value) => {
        if (!value) {
          return "Vui lòng chọn trạng thái";
        }
      }
    });
    
    if (status) {
      try {
        await updateBorrowStatus(borrow.borrowingId, status);
        Swal.fire("Thành công!", status === "RETURNED" ? "Đã xác nhận trả sách" : "Đã cập nhật hết hạn lấy sách", "success");
        fetchBorrows();
      } catch (error) {
        console.error("Error update status:", error);
        Swal.fire("Lỗi!", error.response?.data?.message || "Không thể thực hiện thao tác", "error");
      }
    }
  };

  const stats = {
    total: pagination.totalElements,
    pendingPickup: borrows.filter(b => b.status === "PENDING_PICKUP").length,
    active: borrows.filter(b => b.status === "ACTIVE").length,
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
              onKeyPress={handleKeyPress}
            />
            <button className="search-btn" onClick={handleSearch}>Tìm</button>
          </div>
          <select className="filter-select" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPagination(prev => ({ ...prev, page: 0 })); }}>
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING_PICKUP">Chờ lấy sách</option>
            <option value="ACTIVE">Đang mượn</option>
            <option value="RETURNED">Đã trả</option>
            <option value="OVERDUE">Quá hạn</option>
            <option value="EXPIRED_PICKUP">Hết hạn lấy sách</option>
            <option value="CANCELED">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="table-loading"><div className="spinner"></div><p>Đang tải...</p></div>
        ) : borrows.length === 0 ? (
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
                <th>Hạn trả</th>
                <th>Trạng thái</th>
                <th className="th-actions">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((borrow) => (
                <tr key={borrow.borrowingId}>
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
                      <span className="book-id">Book ID: {borrow.bookId}</span>
                    </div>
                  </td>
                  <td className="date-cell">
                    {borrow.requestAt ? new Date(borrow.requestAt).toLocaleString("vi-VN") : "—"}
                  </td>
                  <td className="date-cell">
                    {borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString("vi-VN") : "—"}
                  </td>
                  <td>{getStatusBadge(borrow.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" title="Xem chi tiết" onClick={() => setViewingBorrow(borrow)}>
                        <Eye size={16} />
                      </button>
                      
                      {/* Chờ lấy sách -> Giao sách hoặc Hết hạn */}
                      {borrow.status === "PENDING_PICKUP" && (
                        <>
                          <button className="action-btn edit" title="Giao sách" onClick={() => handleApprove(borrow)}>
                            <CheckCircle size={16} />
                          </button>
                          <button className="action-btn delete" title="Hết hạn lấy" onClick={() => handleReject(borrow)}>
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
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="table-pagination">
            <button 
              disabled={pagination.page === 0}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Trước
            </button>
            <span>Trang {pagination.page + 1} / {pagination.totalPages}</span>
            <button 
              disabled={pagination.page >= pagination.totalPages - 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Sau
            </button>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewingBorrow && (
        <div className="modal-overlay" onClick={() => setViewingBorrow(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết yêu cầu mượn #{viewingBorrow.borrowingId}</h2>
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
                <p>Book ID: {viewingBorrow.bookId}</p>
              </div>
              <div className="detail-section">
                <h4><Calendar size={16} /> Thời gian</h4>
                <p>Ngày yêu cầu: {viewingBorrow.requestAt ? new Date(viewingBorrow.requestAt).toLocaleString("vi-VN") : "—"}</p>
                <p>Ngày lấy sách: {viewingBorrow.pickupAt ? new Date(viewingBorrow.pickupAt).toLocaleString("vi-VN") : "—"}</p>
                <p>Hạn trả: {viewingBorrow.dueDate ? new Date(viewingBorrow.dueDate).toLocaleDateString("vi-VN") : "—"}</p>
                <p>Ngày trả: {viewingBorrow.returnedAt ? new Date(viewingBorrow.returnedAt).toLocaleString("vi-VN") : "—"}</p>
              </div>
              <div className="detail-section">
                <h4>Trạng thái</h4>
                {getStatusBadge(viewingBorrow.status)}
              </div>
              {viewingBorrow.overdueDays > 0 && (
                <div className="detail-section">
                  <h4>Quá hạn</h4>
                  <p style={{color: '#ef4444'}}>{viewingBorrow.overdueDays} ngày</p>
                </div>
              )}
              {viewingBorrow.fineAmount > 0 && (
                <div className="detail-section">
                  <h4>Phí phạt</h4>
                  <p style={{color: '#ef4444'}}>{viewingBorrow.fineAmount.toLocaleString("vi-VN")}đ</p>
                </div>
              )}
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

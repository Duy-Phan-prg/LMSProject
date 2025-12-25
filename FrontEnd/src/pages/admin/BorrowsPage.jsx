import { useState, useEffect, useCallback } from "react";
import {
  ShoppingCart, Search, Eye, CheckCircle, XCircle, Clock,
  ChevronLeft, ChevronRight, RefreshCw, AlertCircle, X, BookOpen, User, Calendar
} from "lucide-react";
import Swal from "sweetalert2";

export default function BorrowsPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewingBorrow, setViewingBorrow] = useState(null);

  const fetchBorrows = useCallback(async () => {
    // TODO: Gọi API khi backend sẵn sàng
    // setLoading(true);
    // try {
    //   const data = await getAllBorrows(currentPage, pageSize);
    //   setBorrows(data.content || []);
    // } catch (error) {
    //   console.error("Error fetching borrows:", error);
    // } finally {
    //   setLoading(false);
    // }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchBorrows();
  }, [fetchBorrows]);

  const getStatusBadge = (status) => {
    const statuses = {
      BORROWING: { class: "status-borrowing", label: "Đang mượn", icon: <Clock size={14} /> },
      RETURNED: { class: "status-returned", label: "Đã trả", icon: <CheckCircle size={14} /> },
      OVERDUE: { class: "status-overdue", label: "Quá hạn", icon: <AlertCircle size={14} /> },
    };
    const s = statuses[status] || statuses.BORROWING;
    return <span className={`status-badge ${s.class}`}>{s.icon} {s.label}</span>;
  };

  const handleReturn = async (borrowId) => {
    const result = await Swal.fire({
      title: "Xác nhận trả sách?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy"
    });
    if (result.isConfirmed) {
      // TODO: Gọi API khi backend sẵn sàng
      // try {
      //   await returnBook(borrowId);
      //   fetchBorrows();
      //   Swal.fire("Thành công!", "Đã xác nhận trả sách.", "success");
      // } catch (error) {
      //   Swal.fire("Lỗi!", "Không thể xác nhận trả sách", "error");
      // }
    }
  };

  const filteredBorrows = borrows.filter(b => {
    const matchSearch = b.user.fullName.toLowerCase().includes(searchInput.toLowerCase()) ||
                       b.book.title.toLowerCase().includes(searchInput.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: borrows.length,
    borrowing: borrows.filter(b => b.status === "BORROWING").length,
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
            <p className="page-subtitle">Theo dõi tình trạng mượn trả sách</p>
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
            <span className="stat-card-label">Tổng giao dịch</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon orange"><Clock size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.borrowing}</span>
            <span className="stat-card-label">Đang mượn</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><CheckCircle size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.returned}</span>
            <span className="stat-card-label">Đã trả</span>
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
            <input type="text" placeholder="Tìm theo tên người mượn, sách..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          </div>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
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
          <div className="table-empty"><AlertCircle size={48} /><h3>Không có dữ liệu</h3></div>
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
                <th className="th-actions">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrows.map((borrow) => (
                <tr key={borrow.id}>
                  <td><strong>#{borrow.id}</strong></td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar"><span>{borrow.user.fullName.charAt(0)}</span></div>
                      <div className="user-info">
                        <span className="user-name">{borrow.user.fullName}</span>
                        <span className="user-id">{borrow.user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="book-info-cell">
                      <span className="book-name">{borrow.book.title}</span>
                      <span className="book-author">{borrow.book.author}</span>
                    </div>
                  </td>
                  <td>{new Date(borrow.borrowDate).toLocaleDateString("vi-VN")}</td>
                  <td>{new Date(borrow.dueDate).toLocaleDateString("vi-VN")}</td>
                  <td>{borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString("vi-VN") : "-"}</td>
                  <td>{getStatusBadge(borrow.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" onClick={() => setViewingBorrow(borrow)}><Eye size={16} /></button>
                      {borrow.status === "BORROWING" && (
                        <button className="action-btn edit" title="Xác nhận trả" onClick={() => handleReturn(borrow.id)}><CheckCircle size={16} /></button>
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
              <h2>Chi tiết mượn sách #{viewingBorrow.id}</h2>
              <button className="modal-close" onClick={() => setViewingBorrow(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4><User size={16} /> Người mượn</h4>
                <p><strong>{viewingBorrow.user.fullName}</strong></p>
                <p>{viewingBorrow.user.email}</p>
              </div>
              <div className="detail-section">
                <h4><BookOpen size={16} /> Sách</h4>
                <p><strong>{viewingBorrow.book.title}</strong></p>
                <p>{viewingBorrow.book.author}</p>
              </div>
              <div className="detail-section">
                <h4><Calendar size={16} /> Thời gian</h4>
                <p>Ngày mượn: {new Date(viewingBorrow.borrowDate).toLocaleDateString("vi-VN")}</p>
                <p>Hạn trả: {new Date(viewingBorrow.dueDate).toLocaleDateString("vi-VN")}</p>
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

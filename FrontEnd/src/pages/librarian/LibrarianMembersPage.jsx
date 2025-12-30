import { useState, useEffect, useCallback } from "react";
import {
  Users, Search, Eye, ChevronLeft, ChevronRight,
  RefreshCw, AlertCircle, X, Mail, Phone, Calendar, BookOpen
} from "lucide-react";
import Swal from "sweetalert2";
import { getAllUsers } from "../../services/userService";

export default function LibrarianMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [viewingMember, setViewingMember] = useState(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers({ page: currentPage, size: 100 });
      // Lọc chỉ lấy MEMBER (không lấy ADMIN, LIBRARIAN)
      const memberList = (data.content || []).filter(u => u.role === "MEMBER");
      setMembers(memberList);
      setTotalElements(memberList.length);
      setTotalPages(Math.ceil(memberList.length / pageSize));
    } catch (error) {
      console.error("Error fetching members:", error);
      Swal.fire("Lỗi!", "Không thể tải danh sách thành viên", "error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const filteredMembers = members.filter(member =>
    member.fullName?.toLowerCase().includes(searchInput.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchInput.toLowerCase()) ||
    member.phone?.includes(searchInput)
  );

  const stats = {
    total: members.length,
    active: members.filter(m => m.active).length,
    inactive: members.filter(m => !m.active).length,
  };

  return (
    <div className="admin-page members-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><Users size={28} /></div>
          <div>
            <h1 className="page-title">Quản lý thành viên</h1>
            <p className="page-subtitle">Xem danh sách và thông tin thành viên thư viện</p>
          </div>
        </div>
        <div className="page-header-right">
          <button className="btn-secondary" onClick={fetchMembers} disabled={loading}>
            <RefreshCw size={18} className={loading ? "spin" : ""} /> Làm mới
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-icon blue"><Users size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.total}</span>
            <span className="stat-card-label">Tổng thành viên</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><Users size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.active}</span>
            <span className="stat-card-label">Đang hoạt động</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon red"><Users size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.inactive}</span>
            <span className="stat-card-label">Đã khóa</span>
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
              placeholder="Tìm theo tên, email, SĐT..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="table-loading"><div className="spinner"></div><p>Đang tải...</p></div>
        ) : filteredMembers.length === 0 ? (
          <div className="table-empty">
            <AlertCircle size={48} />
            <h3>Không có thành viên nào</h3>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Thành viên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Ngày đăng ký</th>
                <th>Trạng thái</th>
                <th className="th-actions">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.userId}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.fullName} />
                        ) : (
                          <span>{member.fullName?.charAt(0)?.toUpperCase()}</span>
                        )}
                      </div>
                      <div className="user-info">
                        <span className="user-name">{member.fullName}</span>
                        <span className="user-id">ID: {member.userId}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="email-cell">
                      <Mail size={14} />
                      <span>{member.email}</span>
                    </div>
                  </td>
                  <td>
                    <div className="phone-cell">
                      <Phone size={14} />
                      <span>{member.phone || "—"}</span>
                    </div>
                  </td>
                  <td className="date-cell">
                    {member.createdAt ? new Date(member.createdAt).toLocaleDateString("vi-VN") : "—"}
                  </td>
                  <td>
                    <span className={`status-badge ${member.active ? "active" : "inactive"}`}>
                      {member.active ? "Hoạt động" : "Đã khóa"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" onClick={() => setViewingMember(member)}>
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredMembers.length > 0 && (
        <div className="table-pagination">
          <div className="pagination-info">Hiển thị {filteredMembers.length} / {totalElements} thành viên</div>
          <div className="pagination-controls">
            <select className="page-size-select" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
            </select>
            <div className="pagination-buttons">
              <button className="pagination-btn" disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={18} /></button>
              <span className="pagination-btn active">{currentPage + 1}</span>
              <button className="pagination-btn" disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingMember && (
        <div className="modal-overlay" onClick={() => setViewingMember(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Thông tin thành viên</h2>
              <button className="modal-close" onClick={() => setViewingMember(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="user-detail-header">
                <div className="user-detail-avatar">
                  {viewingMember.avatar ? (
                    <img src={viewingMember.avatar} alt={viewingMember.fullName} />
                  ) : (
                    viewingMember.fullName?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div className="user-detail-info">
                  <h3>{viewingMember.fullName}</h3>
                  <p>{viewingMember.email}</p>
                </div>
              </div>
              <div className="user-detail-grid">
                <div className="detail-item">
                  <label>ID</label>
                  <span>{viewingMember.userId}</span>
                </div>
                <div className="detail-item">
                  <label>Số điện thoại</label>
                  <span>{viewingMember.phone || "Chưa cập nhật"}</span>
                </div>
                <div className="detail-item">
                  <label>Ngày đăng ký</label>
                  <span>{viewingMember.createdAt ? new Date(viewingMember.createdAt).toLocaleDateString("vi-VN") : "—"}</span>
                </div>
                <div className="detail-item">
                  <label>Trạng thái</label>
                  <span className={viewingMember.active ? "text-success" : "text-danger"}>
                    {viewingMember.active ? "Đang hoạt động" : "Đã khóa"}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setViewingMember(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import {
  Users, Search, Download, Upload,
  Edit, Trash2, Eye, Mail, Phone, Shield, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, RefreshCw, UserPlus, AlertCircle, X
} from "lucide-react";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../../services/userService";
import Swal from "sweetalert2";

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  
  // Selection
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  // Fetch users khi params thay đổi
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllUsers({
        page: currentPage,
        size: pageSize,
        keyword: searchTerm,
        isActive: filterStatus === "" ? undefined : filterStatus === "true",
      });
      
      setUsers(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire("Lỗi", "Không thể tải danh sách người dùng", "error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, filterStatus]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Search handler - debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Filter change handler
  const handleFilterChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(0);
  };

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Delete handler
  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy"
    });
    if (result.isConfirmed) {
      try {
        await deleteUser(userId);
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Đã xóa người dùng khỏi hệ thống",
          confirmButtonColor: "#3b82f6"
        });
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        const message = error.response?.data?.message || "Không thể xóa người dùng";
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: message,
          confirmButtonColor: "#3b82f6"
        });
      }
    }
  };

  // View handler
  const handleView = (user) => {
    setViewingUser(user.id);
  };

  // Edit handler
  const handleEdit = (user) => {
    setEditingUser(user);
    setShowAddModal(true);
  };

  // Role badge
  const getRoleBadge = (role) => {
    const roles = {
      ADMIN: { class: "badge-admin", label: "Admin" },
      LIBRARIAN: { class: "badge-librarian", label: "Thủ thư" },
      MEMBER: { class: "badge-member", label: "Thành viên" }
    };
    const r = roles[role] || roles.MEMBER;
    return <span className={`role-badge ${r.class}`}>{r.label}</span>;
  };

  // Stats
  const stats = {
    total: totalElements,
    active: users.filter(u => u.active).length,
    admin: users.filter(u => u.role === "ADMIN").length,
    inactive: users.filter(u => !u.active).length,
  };

  return (
    <div className="admin-page users-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon">
            <Users size={28} />
          </div>
          <div>
            <h1 className="page-title">Quản lý người dùng</h1>
            <p className="page-subtitle">Quản lý tất cả người dùng trong hệ thống</p>
          </div>
        </div>
        <div className="page-header-right">
          <button className="btn-secondary" onClick={fetchUsers} disabled={loading}>
            <RefreshCw size={18} className={loading ? "spin" : ""} /> Làm mới
          </button>
          <button className="btn-primary" onClick={() => { setEditingUser(null); setShowAddModal(true); }}>
            <UserPlus size={18} /> Thêm người dùng
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-icon blue"><Users size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.total}</span>
            <span className="stat-card-label">Tổng người dùng</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><CheckCircle size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.active}</span>
            <span className="stat-card-label">Đang hoạt động</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon orange"><Shield size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.admin}</span>
            <span className="stat-card-label">Quản trị viên</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon red"><XCircle size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.inactive}</span>
            <span className="stat-card-label">Đã khóa</span>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <div className="search-input">
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, SĐT..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Đã khóa</option>
          </select>
        </div>
        <div className="toolbar-right">
          {selectedUsers.length > 0 && (
            <span className="selected-count">Đã chọn {selectedUsers.length}</span>
          )}
          <button className="btn-icon" title="Xuất Excel"><Download size={18} /></button>
          <button className="btn-icon" title="Nhập dữ liệu"><Upload size={18} /></button>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        {loading ? (
          <div className="table-loading">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="table-empty">
            <AlertCircle size={48} />
            <h3>Không có dữ liệu</h3>
            <p>Không tìm thấy người dùng nào phù hợp</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th className="th-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th className="th-actions">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className={selectedUsers.includes(user.id) ? "selected" : ""}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.fullName} />
                        ) : (
                          <span>{user.fullName?.charAt(0) || "U"}</span>
                        )}
                      </div>
                      <div className="user-info">
                        <span className="user-name">{user.fullName}</span>
                        <span className="user-id">ID: {user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="email-cell"><Mail size={14} />{user.email}</div>
                  </td>
                  <td>
                    <div className="phone-cell">
                      <Phone size={14} />{user.phone || "Chưa cập nhật"}
                    </div>
                  </td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>
                    <span className={`status-badge ${user.active ? "active" : "inactive"}`}>
                      {user.active ? (<><CheckCircle size={14} /> Hoạt động</>) : (<><XCircle size={14} /> Đã khóa</>)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" title="Xem" onClick={() => handleView(user)}><Eye size={16} /></button>
                      <button className="action-btn edit" title="Sửa" onClick={() => handleEdit(user)}><Edit size={16} /></button>
                      <button className="action-btn delete" title="Xóa" onClick={() => handleDelete(user.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <div className="table-pagination">
          <div className="pagination-info">
            Hiển thị {users.length} / {totalElements} người dùng
          </div>
          <div className="pagination-controls">
            <select
              className="page-size-select"
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(0); }}
            >
              <option value={5}>5 / trang</option>
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
            </select>
            <div className="pagination-buttons">
              <button
                className="pagination-btn"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                <ChevronLeft size={18} />
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                let pageNum = idx;
                if (totalPages > 5) {
                  if (currentPage < 3) pageNum = idx;
                  else if (currentPage > totalPages - 3) pageNum = totalPages - 5 + idx;
                  else pageNum = currentPage - 2 + idx;
                }
                if (pageNum < 0 || pageNum >= totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
              <button
                className="pagination-btn"
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {viewingUser && (
        <ViewUserModal userId={viewingUser} onClose={() => setViewingUser(null)} />
      )}

      {/* Add/Edit User Modal */}
      {showAddModal && (
        <UserFormModal
          user={editingUser}
          onClose={() => { setShowAddModal(false); setEditingUser(null); }}
          onSuccess={() => { fetchUsers(); setShowAddModal(false); setEditingUser(null); }}
        />
      )}
    </div>
  );
}

// View User Modal Component
function ViewUserModal({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getUserById(userId);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        Swal.fire("Lỗi", "Không thể tải thông tin người dùng", "error");
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Thông tin người dùng</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">
              <div className="spinner"></div>
              <p>Đang tải...</p>
            </div>
          ) : user ? (
            <>
              <div className="user-detail-header">
                <div className="user-detail-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} />
                  ) : (
                    <span>{user.fullName?.charAt(0) || "U"}</span>
                  )}
                </div>
                <div className="user-detail-info">
                  <h3>{user.fullName}</h3>
                  <p>{user.email}</p>
                </div>
              </div>
              <div className="user-detail-grid">
                <div className="detail-item">
                  <label>ID</label>
                  <span>{user.id}</span>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <span>{user.email}</span>
                </div>
                <div className="detail-item">
                  <label>Số điện thoại</label>
                  <span>{user.phone || "Chưa cập nhật"}</span>
                </div>
                <div className="detail-item">
                  <label>Địa chỉ</label>
                  <span>{user.address || "Chưa cập nhật"}</span>
                </div>
                <div className="detail-item">
                  <label>Vai trò</label>
                  <span>{user.role}</span>
                </div>
                <div className="detail-item">
                  <label>Trạng thái</label>
                  <span className={user.active ? "text-success" : "text-danger"}>
                    {user.active ? "Đang hoạt động" : "Đã khóa"}
                  </span>
                </div>
              </div>
            </>
          ) : null}
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
}

// User Form Modal Component (Add/Edit)
function UserFormModal({ user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    role: user?.role || "MEMBER",
    password: "",
    active: user?.active !== undefined ? user.active : true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Vui lòng nhập họ tên";
        if (value.trim().length < 2) return "Họ tên tối thiểu 2 ký tự";
        return "";
      case "email":
        if (!value.trim()) return "Vui lòng nhập email";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email không hợp lệ";
        return "";
      case "phone":
        if (value && !/^[0-9]{10,11}$/.test(value)) return "Số điện thoại phải có 10-11 số";
        return "";
      case "password":
        if (!user && !value) return "Vui lòng nhập mật khẩu";
        if (!user && value.length < 6) return "Mật khẩu tối thiểu 6 ký tự";
        if (user && value && value.length < 6) return "Mật khẩu tối thiểu 6 ký tự";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (name) => {
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validate = () => {
    const newErrors = {};
    newErrors.fullName = validateField("fullName", formData.fullName);
    newErrors.email = validateField("email", formData.email);
    newErrors.phone = validateField("phone", formData.phone);
    newErrors.password = validateField("password", formData.password);
    
    // Remove empty errors
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      Swal.fire({
        icon: "warning",
        title: "Thông tin chưa hợp lệ",
        text: "Vui lòng kiểm tra lại các trường đã nhập",
        confirmButtonColor: "#3b82f6"
      });
      return;
    }

    setLoading(true);
    try {
      if (user) {
        // Update user
        await updateUser(user.id, formData);
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: `Đã cập nhật thông tin người dùng "${formData.fullName}"`,
          confirmButtonColor: "#3b82f6"
        });
      } else {
        // Create new user
        await createUser(formData);
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: `Đã thêm người dùng "${formData.fullName}" vào hệ thống`,
          confirmButtonColor: "#3b82f6"
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      const message = error.response?.data?.message || error.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại";
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: message,
        confirmButtonColor: "#3b82f6"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{user ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Họ và tên <span className="required">*</span></label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => handleChange("fullName", e.target.value)}
                onBlur={() => handleBlur("fullName")}
                placeholder="Nhập họ và tên"
                className={errors.fullName ? "input-error" : ""}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="Nhập email"
                  disabled={!!user}
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => handleChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  placeholder="Nhập số điện thoại"
                  className={errors.phone ? "input-error" : ""}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => handleChange("address", e.target.value)}
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Vai trò <span className="required">*</span></label>
                <select
                  value={formData.role}
                  onChange={e => handleChange("role", e.target.value)}
                >
                  <option value="MEMBER">Thành viên</option>
                  <option value="LIBRARIAN">Thủ thư</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Mật khẩu {!user && <span className="required">*</span>}</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  placeholder={user ? "Để trống nếu không đổi" : "Nhập mật khẩu (tối thiểu 6 ký tự)"}
                  className={errors.password ? "input-error" : ""}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
            </div>
            {user && (
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={formData.active ? "true" : "false"}
                  onChange={e => handleChange("active", e.target.value === "true")}
                >
                  <option value="true">Đang hoạt động</option>
                  <option value="false">Khóa tài khoản</option>
                </select>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Hủy</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Đang xử lý..." : (user ? "Cập nhật" : "Thêm mới")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import {
  Shield, Search, Eye, Lock, Unlock, UserPlus, UserMinus, Plus,
  Edit, Trash2, RefreshCw, AlertCircle, X, Mail, Phone
} from "lucide-react";
import Swal from "sweetalert2";
import { getAllUsers, createUser, updateUser, deleteUser } from "../../services/userService";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers({ page: 0, size: 100 });
      setUsers(data.content || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire("Lỗi!", "Không thể tải danh sách người dùng", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Khóa/Mở khóa user
  const handleToggleStatus = async (user) => {
    const action = user.active ? "khóa" : "mở khóa";
    const result = await Swal.fire({
      title: `Xác nhận ${action}?`,
      text: `Bạn có chắc muốn ${action} tài khoản "${user.fullName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: user.active ? "#ef4444" : "#22c55e",
      cancelButtonColor: "#64748b",
      confirmButtonText: user.active ? "Khóa" : "Mở khóa",
      cancelButtonText: "Hủy"
    });
    if (result.isConfirmed) {
      try {
        await updateUser(user.userId, { ...user, active: !user.active });
        Swal.fire("Thành công!", `Đã ${action} tài khoản.`, "success");
        fetchUsers();
      } catch (error) {
        Swal.fire("Lỗi!", error.response?.data?.message || "Không thể thực hiện", "error");
      }
    }
  };

  // Gán quyền Librarian
  const handlePromoteToLibrarian = async (user) => {
    const result = await Swal.fire({
      title: "Gán quyền Librarian?",
      text: `Bạn có chắc muốn gán quyền LIBRARIAN cho "${user.fullName}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d4a853",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Gán quyền",
      cancelButtonText: "Hủy"
    });
    if (result.isConfirmed) {
      try {
        await updateUser(user.userId, { ...user, role: "LIBRARIAN" });
        Swal.fire("Thành công!", "Đã gán quyền LIBRARIAN.", "success");
        fetchUsers();
      } catch (error) {
        Swal.fire("Lỗi!", error.response?.data?.message || "Không thể thực hiện", "error");
      }
    }
  };

  // Thu hồi quyền Librarian
  const handleDemoteToMember = async (user) => {
    const result = await Swal.fire({
      title: "Thu hồi quyền Librarian?",
      text: `Bạn có chắc muốn thu hồi quyền LIBRARIAN của "${user.fullName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Thu hồi",
      cancelButtonText: "Hủy"
    });
    if (result.isConfirmed) {
      try {
        await updateUser(user.userId, { ...user, role: "MEMBER" });
        Swal.fire("Thành công!", "Đã thu hồi quyền LIBRARIAN.", "success");
        fetchUsers();
      } catch (error) {
        Swal.fire("Lỗi!", error.response?.data?.message || "Không thể thực hiện", "error");
      }
    }
  };

  // Xóa user
  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc muốn xóa tài khoản này?",
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
        Swal.fire("Thành công!", "Đã xóa tài khoản.", "success");
        fetchUsers();
      } catch (error) {
        Swal.fire("Lỗi!", error.response?.data?.message || "Không thể xóa", "error");
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = user.fullName?.toLowerCase().includes(searchInput.toLowerCase()) ||
                       user.email?.toLowerCase().includes(searchInput.toLowerCase());
    const matchRole = filterRole === "all" || user.role === filterRole;
    return matchSearch && matchRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === "ADMIN").length,
    librarians: users.filter(u => u.role === "LIBRARIAN").length,
    members: users.filter(u => u.role === "MEMBER").length,
    active: users.filter(u => u.active).length,
    locked: users.filter(u => !u.active).length,
  };

  const getRoleBadge = (role) => {
    const roles = {
      ADMIN: { class: "badge-admin", label: "Admin" },
      LIBRARIAN: { class: "badge-librarian", label: "Librarian" },
      MEMBER: { class: "badge-member", label: "Member" }
    };
    const r = roles[role] || roles.MEMBER;
    return <span className={`role-badge ${r.class}`}>{r.label}</span>;
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><Shield size={28} /></div>
          <div>
            <h1 className="page-title">Quản lý phân quyền</h1>
            <p className="page-subtitle">Quản lý user, gán/thu hồi quyền, khóa/mở khóa tài khoản</p>
          </div>
        </div>
        <div className="page-header-right">
          <button className="btn-secondary" onClick={fetchUsers} disabled={loading}>
            <RefreshCw size={18} className={loading ? "spin" : ""} /> Làm mới
          </button>
          <button className="btn-primary" onClick={() => { setEditingUser(null); setShowModal(true); }}>
            <Plus size={18} /> Thêm Librarian
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-icon blue"><Shield size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.total}</span>
            <span className="stat-card-label">Tổng user</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon orange"><Shield size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.librarians}</span>
            <span className="stat-card-label">Librarian</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><Shield size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.members}</span>
            <span className="stat-card-label">Member</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon red"><Lock size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.locked}</span>
            <span className="stat-card-label">Đã khóa</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <div className="search-input">
            <Search size={18} />
            <input type="text" placeholder="Tìm theo tên, email..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          </div>
          <select className="filter-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">Tất cả role</option>
            <option value="ADMIN">Admin</option>
            <option value="LIBRARIAN">Librarian</option>
            <option value="MEMBER">Member</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="table-loading"><div className="spinner"></div><p>Đang tải...</p></div>
        ) : filteredUsers.length === 0 ? (
          <div className="table-empty"><AlertCircle size={48} /><h3>Không có dữ liệu</h3></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Role</th>
                <th>Trạng thái</th>
                <th className="th-actions">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.userId}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar"><span>{user.fullName?.charAt(0)?.toUpperCase()}</span></div>
                      <div className="user-info">
                        <span className="user-name">{user.fullName}</span>
                        <span className="user-id">ID: {user.userId}</span>
                      </div>
                    </div>
                  </td>
                  <td><div className="email-cell"><Mail size={14} /><span>{user.email}</span></div></td>
                  <td><div className="phone-cell"><Phone size={14} /><span>{user.phone || "—"}</span></div></td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>
                    <span className={`status-badge ${user.active ? "active" : "inactive"}`}>
                      {user.active ? "Hoạt động" : "Đã khóa"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" title="Xem" onClick={() => setViewingUser(user)}><Eye size={16} /></button>
                      
                      {/* Chỉ cho phép thao tác với non-ADMIN */}
                      {user.role !== "ADMIN" && (
                        <>
                          {/* Gán/Thu hồi quyền Librarian */}
                          {user.role === "MEMBER" ? (
                            <button className="action-btn edit" title="Gán quyền Librarian" onClick={() => handlePromoteToLibrarian(user)}>
                              <UserPlus size={16} />
                            </button>
                          ) : user.role === "LIBRARIAN" && (
                            <button className="action-btn" title="Thu hồi quyền" onClick={() => handleDemoteToMember(user)} style={{background: 'rgba(249,115,22,0.2)', color: '#fb923c'}}>
                              <UserMinus size={16} />
                            </button>
                          )}
                          
                          {/* Khóa/Mở khóa */}
                          <button 
                            className={`action-btn ${user.active ? "delete" : "edit"}`} 
                            title={user.active ? "Khóa" : "Mở khóa"}
                            onClick={() => handleToggleStatus(user)}
                          >
                            {user.active ? <Lock size={16} /> : <Unlock size={16} />}
                          </button>

                          {/* Sửa Librarian */}
                          {user.role === "LIBRARIAN" && (
                            <button className="action-btn view" title="Sửa" onClick={() => { setEditingUser(user); setShowModal(true); }}>
                              <Edit size={16} />
                            </button>
                          )}
                        </>
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
      {viewingUser && (
        <div className="modal-overlay" onClick={() => setViewingUser(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Thông tin User</h2>
              <button className="modal-close" onClick={() => setViewingUser(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="user-detail-header">
                <div className="user-detail-avatar">{viewingUser.fullName?.charAt(0)?.toUpperCase()}</div>
                <div className="user-detail-info">
                  <h3>{viewingUser.fullName}</h3>
                  <p>{viewingUser.email}</p>
                </div>
              </div>
              <div className="user-detail-grid">
                <div className="detail-item"><label>ID</label><span>{viewingUser.userId}</span></div>
                <div className="detail-item"><label>Role</label>{getRoleBadge(viewingUser.role)}</div>
                <div className="detail-item"><label>SĐT</label><span>{viewingUser.phone || "—"}</span></div>
                <div className="detail-item"><label>Địa chỉ</label><span>{viewingUser.address || "—"}</span></div>
                <div className="detail-item"><label>Ngày tạo</label><span>{viewingUser.createdAt ? new Date(viewingUser.createdAt).toLocaleDateString("vi-VN") : "—"}</span></div>
                <div className="detail-item"><label>Trạng thái</label><span className={viewingUser.active ? "text-success" : "text-danger"}>{viewingUser.active ? "Hoạt động" : "Đã khóa"}</span></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setViewingUser(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal - Thêm/Sửa Librarian */}
      {showModal && (
        <LibrarianFormModal
          librarian={editingUser}
          onClose={() => { setShowModal(false); setEditingUser(null); }}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
}

function LibrarianFormModal({ librarian, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: librarian?.fullName || "",
    email: librarian?.email || "",
    phone: librarian?.phone || "",
    address: librarian?.address || "",
    password: "",
    active: librarian?.active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Họ tên không được để trống";
    if (!formData.email.trim()) newErrors.email = "Email không được để trống";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    if (!librarian && !formData.password) newErrors.password = "Mật khẩu không được để trống";
    if (formData.password && formData.password.length < 6) newErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        role: "LIBRARIAN",
        active: formData.active,
      };
      if (formData.password) payload.password = formData.password;

      if (librarian) {
        await updateUser(librarian.userId, payload);
        Swal.fire("Thành công!", "Đã cập nhật Librarian", "success");
      } else {
        await createUser(payload);
        Swal.fire("Thành công!", "Đã thêm Librarian mới", "success");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      Swal.fire("Lỗi!", error.response?.data?.message || "Không thể lưu", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{librarian ? "Chỉnh sửa Librarian" : "Thêm Librarian mới"}</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Họ tên <span className="required">*</span></label>
              <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className={errors.fullName ? "input-error" : ""} />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>
            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={errors.email ? "input-error" : ""} />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Mật khẩu {!librarian && <span className="required">*</span>}</label>
              <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder={librarian ? "Để trống nếu không đổi" : ""} className={errors.password ? "input-error" : ""} />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Số điện thoại</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
            {librarian && (
              <div className="form-group">
                <label className="checkbox-item">
                  <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} />
                  <span>Kích hoạt tài khoản</span>
                </label>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Đang xử lý..." : (librarian ? "Cập nhật" : "Thêm mới")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

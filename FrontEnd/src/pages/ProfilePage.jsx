import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Shield } from "lucide-react";
import { getUserById, updateUser } from "../services/userService";
import Swal from "sweetalert2";
import "../styles/profile.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await getUserById(userId);
      const userData = response.result || response;
      setUser(userData);
      setFormData({
        fullName: userData.fullName || "",
        phone: userData.phone || "",
        address: userData.address || "",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      Swal.fire("Lỗi!", "Không thể tải thông tin người dùng", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await updateUser(userId, {
        ...user,
        ...formData,
      });
      setUser({ ...user, ...formData });
      setEditing(false);
      Swal.fire("Thành công!", "Đã cập nhật thông tin", "success");
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire("Lỗi!", "Không thể cập nhật thông tin", "error");
    }
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
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{user?.fullName?.charAt(0)?.toUpperCase() || "U"}</span>
          </div>
          <div className="profile-header-info">
            <h1>{user?.fullName}</h1>
            <p className="profile-role">
              <Shield size={16} />
              {user?.role === "ADMIN" ? "Quản trị viên" : 
               user?.role === "LIBRARIAN" ? "Thủ thư" : "Thành viên"}
            </p>
          </div>
          {!editing ? (
            <button className="btn-edit" onClick={() => setEditing(true)}>
              <Edit2 size={18} /> Chỉnh sửa
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn-save" onClick={handleSave}>
                <Save size={18} /> Lưu
              </button>
              <button className="btn-cancel" onClick={() => setEditing(false)}>
                <X size={18} /> Hủy
              </button>
            </div>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h3>Thông tin cá nhân</h3>
            <div className="profile-fields">
              <div className="profile-field">
                <label><User size={16} /> Họ và tên</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                ) : (
                  <span>{user?.fullName || "Chưa cập nhật"}</span>
                )}
              </div>
              <div className="profile-field">
                <label><Mail size={16} /> Email</label>
                <span>{user?.email}</span>
              </div>
              <div className="profile-field">
                <label><Phone size={16} /> Số điện thoại</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                ) : (
                  <span>{user?.phone || "Chưa cập nhật"}</span>
                )}
              </div>
              <div className="profile-field">
                <label><MapPin size={16} /> Địa chỉ</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                ) : (
                  <span>{user?.address || "Chưa cập nhật"}</span>
                )}
              </div>
              <div className="profile-field">
                <label><Calendar size={16} /> Ngày tham gia</label>
                <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

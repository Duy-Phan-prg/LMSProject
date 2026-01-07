import { useState } from "react";
import { Settings, Bell, Lock, Eye, EyeOff, Save, Shield } from "lucide-react";
import Swal from "sweetalert2";
import "../styles/profile.css";

export default function SettingsPage() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    borrowReminder: true,
    newBooks: false,
    promotions: false,
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Swal.fire("Lỗi!", "Mật khẩu xác nhận không khớp", "error");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      Swal.fire("Lỗi!", "Mật khẩu mới phải có ít nhất 6 ký tự", "error");
      return;
    }

    try {
      // TODO: Gọi API đổi mật khẩu khi có endpoint
      Swal.fire("Thành công!", "Đã đổi mật khẩu", "success");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      Swal.fire("Lỗi!", "Không thể đổi mật khẩu", "error");
    }
  };

  const handleSaveNotifications = () => {
    // TODO: Lưu cài đặt thông báo
    Swal.fire("Thành công!", "Đã lưu cài đặt thông báo", "success");
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="page-title-section">
          <Settings size={32} />
          <div>
            <h1>Cài đặt</h1>
            <p>Quản lý tài khoản và tùy chọn của bạn</p>
          </div>
        </div>

        <div className="settings-sections">
          {/* Đổi mật khẩu */}
          <div className="settings-section">
            <div className="section-header">
              <Lock size={20} />
              <h3>Đổi mật khẩu</h3>
            </div>
            <form onSubmit={handleChangePassword} className="password-form">
              <div className="form-group">
                <label>Mật khẩu hiện tại</label>
                <div className="password-input">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                  <button type="button" onClick={() => setShowOldPassword(!showOldPassword)}>
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Mật khẩu mới</label>
                <div className="password-input">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="Nhập mật khẩu mới"
                    required
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu mới</label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn-primary">
                <Save size={18} /> Đổi mật khẩu
              </button>
            </form>
          </div>

          {/* Thông báo */}
          <div className="settings-section">
            <div className="section-header">
              <Bell size={20} />
              <h3>Cài đặt thông báo</h3>
            </div>
            <div className="notification-settings">
              <div className="notification-item">
                <div className="notification-info">
                  <span className="notification-title">Thông báo qua email</span>
                  <span className="notification-desc">Nhận thông báo quan trọng qua email</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="notification-item">
                <div className="notification-info">
                  <span className="notification-title">Nhắc nhở trả sách</span>
                  <span className="notification-desc">Nhận thông báo khi sắp đến hạn trả sách</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.borrowReminder}
                    onChange={(e) => setNotifications({ ...notifications, borrowReminder: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="notification-item">
                <div className="notification-info">
                  <span className="notification-title">Sách mới</span>
                  <span className="notification-desc">Nhận thông báo khi có sách mới</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.newBooks}
                    onChange={(e) => setNotifications({ ...notifications, newBooks: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="notification-item">
                <div className="notification-info">
                  <span className="notification-title">Khuyến mãi</span>
                  <span className="notification-desc">Nhận thông tin về các chương trình khuyến mãi</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.promotions}
                    onChange={(e) => setNotifications({ ...notifications, promotions: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <button className="btn-primary" onClick={handleSaveNotifications}>
                <Save size={18} /> Lưu cài đặt
              </button>
            </div>
          </div>

          {/* Bảo mật */}
          <div className="settings-section">
            <div className="section-header">
              <Shield size={20} />
              <h3>Bảo mật</h3>
            </div>
            <div className="security-info">
              <p>Tài khoản của bạn được bảo vệ bằng mật khẩu. Hãy đảm bảo sử dụng mật khẩu mạnh và không chia sẻ với người khác.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

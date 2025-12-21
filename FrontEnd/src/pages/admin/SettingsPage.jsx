import { useState } from "react";
import {
  Settings, User, Bell, Shield, Palette, Globe, Save,
  Mail, Phone, MapPin, Camera, Eye, EyeOff
} from "lucide-react";
import Swal from "sweetalert2";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  
  const [profile, setProfile] = useState({
    fullName: "Admin",
    email: "admin@libraryhub.vn",
    phone: "0901234567",
    address: "Hà Nội, Việt Nam",
  });

  const [notifications, setNotifications] = useState({
    emailNewBorrow: true,
    emailOverdue: true,
    emailNewUser: false,
    pushNewBorrow: true,
    pushOverdue: true,
    pushNewUser: true,
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [library, setLibrary] = useState({
    name: "LibraryHub",
    borrowDays: 14,
    maxBorrowBooks: 5,
    finePerDay: 5000,
  });

  const handleSave = () => {
    Swal.fire("Thành công!", "Đã lưu cài đặt", "success");
  };

  const tabs = [
    { id: "profile", label: "Hồ sơ", icon: <User size={18} /> },
    { id: "notifications", label: "Thông báo", icon: <Bell size={18} /> },
    { id: "security", label: "Bảo mật", icon: <Shield size={18} /> },
    { id: "library", label: "Thư viện", icon: <Settings size={18} /> },
  ];

  return (
    <div className="admin-page settings-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><Settings size={28} /></div>
          <div>
            <h1 className="page-title">Cài đặt</h1>
            <p className="page-subtitle">Quản lý cài đặt hệ thống</p>
          </div>
        </div>
      </div>

      <div className="settings-layout">
        {/* Tabs */}
        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content">
          {activeTab === "profile" && (
            <div className="settings-section">
              <h3>Thông tin cá nhân</h3>
              <div className="profile-avatar-section">
                <div className="profile-avatar-large">
                  <img src="https://ui-avatars.com/api/?name=Admin&background=1e3a5f&color=fff&size=120" alt="Avatar" />
                  <button className="avatar-edit-btn"><Camera size={16} /></button>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input type="text" value={profile.fullName} onChange={e => setProfile({...profile, fullName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input type="text" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} />
                </div>
              </div>
              <button className="btn-primary" onClick={handleSave}><Save size={18} /> Lưu thay đổi</button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="settings-section">
              <h3>Cài đặt thông báo</h3>
              <div className="notification-group">
                <h4>Email</h4>
                <label className="toggle-item">
                  <span>Thông báo khi có mượn sách mới</span>
                  <input type="checkbox" checked={notifications.emailNewBorrow} onChange={e => setNotifications({...notifications, emailNewBorrow: e.target.checked})} />
                </label>
                <label className="toggle-item">
                  <span>Thông báo sách quá hạn</span>
                  <input type="checkbox" checked={notifications.emailOverdue} onChange={e => setNotifications({...notifications, emailOverdue: e.target.checked})} />
                </label>
                <label className="toggle-item">
                  <span>Thông báo thành viên mới</span>
                  <input type="checkbox" checked={notifications.emailNewUser} onChange={e => setNotifications({...notifications, emailNewUser: e.target.checked})} />
                </label>
              </div>
              <div className="notification-group">
                <h4>Push Notification</h4>
                <label className="toggle-item">
                  <span>Thông báo khi có mượn sách mới</span>
                  <input type="checkbox" checked={notifications.pushNewBorrow} onChange={e => setNotifications({...notifications, pushNewBorrow: e.target.checked})} />
                </label>
                <label className="toggle-item">
                  <span>Thông báo sách quá hạn</span>
                  <input type="checkbox" checked={notifications.pushOverdue} onChange={e => setNotifications({...notifications, pushOverdue: e.target.checked})} />
                </label>
                <label className="toggle-item">
                  <span>Thông báo thành viên mới</span>
                  <input type="checkbox" checked={notifications.pushNewUser} onChange={e => setNotifications({...notifications, pushNewUser: e.target.checked})} />
                </label>
              </div>
              <button className="btn-primary" onClick={handleSave}><Save size={18} /> Lưu thay đổi</button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="settings-section">
              <h3>Đổi mật khẩu</h3>
              <div className="form-grid single">
                <div className="form-group">
                  <label>Mật khẩu hiện tại</label>
                  <div className="password-input">
                    <input type={showPassword ? "text" : "password"} value={security.currentPassword} onChange={e => setSecurity({...security, currentPassword: e.target.value})} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <input type="password" value={security.newPassword} onChange={e => setSecurity({...security, newPassword: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <input type="password" value={security.confirmPassword} onChange={e => setSecurity({...security, confirmPassword: e.target.value})} />
                </div>
              </div>
              <button className="btn-primary" onClick={handleSave}><Save size={18} /> Đổi mật khẩu</button>
            </div>
          )}

          {activeTab === "library" && (
            <div className="settings-section">
              <h3>Cài đặt thư viện</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Tên thư viện</label>
                  <input type="text" value={library.name} onChange={e => setLibrary({...library, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Số ngày mượn tối đa</label>
                  <input type="number" value={library.borrowDays} onChange={e => setLibrary({...library, borrowDays: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Số sách mượn tối đa</label>
                  <input type="number" value={library.maxBorrowBooks} onChange={e => setLibrary({...library, maxBorrowBooks: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phí phạt/ngày (VNĐ)</label>
                  <input type="number" value={library.finePerDay} onChange={e => setLibrary({...library, finePerDay: e.target.value})} />
                </div>
              </div>
              <button className="btn-primary" onClick={handleSave}><Save size={18} /> Lưu thay đổi</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

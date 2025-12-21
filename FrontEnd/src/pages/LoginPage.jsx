import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookOpen, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import Swal from "sweetalert2";
import "../styles/login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await login(formData.email, formData.password);
      
      Swal.fire({
        icon: "success",
        title: "Đăng nhập thành công!",
        text: `Chào mừng bạn quay trở lại`,
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirect based on role
      if (response.role === "ADMIN" || response.role === "LIBRARIAN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      const message = error.response?.data?.message || "Email hoặc mật khẩu không đúng";
      Swal.fire({
        icon: "error",
        title: "Đăng nhập thất bại",
        text: message,
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left side - Branding */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="brand-logo">
              <BookOpen size={48} />
            </div>
            <h1>Thư Viện Số</h1>
            <p>Hệ thống quản lý thư viện hiện đại, giúp bạn dễ dàng tìm kiếm và mượn sách.</p>
            <div className="branding-features">
              <div className="feature-item">
                <span className="feature-icon">📚</span>
                <span>Hơn 10,000+ đầu sách</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔍</span>
                <span>Tìm kiếm nhanh chóng</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <span>Quản lý mọi lúc mọi nơi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="login-form-section">
          <div className="login-form-container">
            <div className="login-header">
              <h2>Đăng nhập</h2>
              <p>Chào mừng bạn quay trở lại!</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? "input-error" : ""}
                  />
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={errors.password ? "input-error" : ""}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <a href="/forgot-password" className="forgot-link">Quên mật khẩu?</a>
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    <LogIn size={18} />
                    Đăng nhập
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

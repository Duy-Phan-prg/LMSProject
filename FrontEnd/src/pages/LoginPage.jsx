import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookOpen, Mail, Lock, Eye, EyeOff, LogIn, Home } from "lucide-react";
import Swal from "sweetalert2";
import "../styles/login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  
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

  const loginWithGoogle = () => {
    googleLogin();
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

              <div className="divider">
                <span>Hoặc</span>
              </div>

              <button 
                type="button" 
                className="btn-google"
                onClick={loginWithGoogle}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Đăng nhập với Google
              </button>
            </form>

            <div className="login-footer">
              <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
              <button 
                type="button" 
                className="btn-back-home"
                onClick={() => navigate("/")}
              >
                <Home size={16} />
                Quay về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

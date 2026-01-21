import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { FcGoogle } from 'react-icons/fc';
import './LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      Swal.fire({
        icon: 'success',
        title: 'Đăng nhập thành công',
        timer: 1500,
      });
      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Đăng nhập thất bại',
        text: error.message || 'Email hoặc mật khẩu không đúng',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    googleLogin();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Đăng Nhập</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Nhập email của bạn"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Mật khẩu
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="divider">
          <span>Hoặc</span>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary w-100 google-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <FcGoogle size={20} className="me-2" />
          Đăng nhập với Google
        </button>

        <p className="text-center mt-3">
          Chưa có tài khoản?{' '}
          <a href="/register" className="text-decoration-none">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

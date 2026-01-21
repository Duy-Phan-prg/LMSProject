import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import Swal from 'sweetalert2';

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();
  const [status, setStatus] = useState('processing');
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent double execution in StrictMode
    if (processedRef.current) return;
    processedRef.current = true;

    const handleCallback = async () => {
      try {
        // Lấy tokens từ URL query params và lưu vào localStorage
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        console.log('OAuth2 Callback - Tokens received:', { accessToken: !!accessToken, refreshToken: !!refreshToken });

        if (accessToken && refreshToken) {
          // Lưu tokens TRƯỚC
          authService.setTokens(accessToken, refreshToken);
          
          setStatus('success');
          setIsAuthenticated(true);
          
          // Chờ một chút để đảm bảo localStorage được cập nhật
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Lấy thông tin user trực tiếp từ authService
          try {
            const user = await authService.getCurrentUser();
            console.log('OAuth2 Callback - User fetched:', user);
            
            setUser(user);
            
            // Lưu userId vào localStorage (giống như login thường)
            if (user?.id) {
              localStorage.setItem('userId', user.id);
            }
            
            Swal.fire({
              icon: 'success',
              title: 'Đăng nhập thành công!',
              text: `Chào mừng ${user?.fullName || user?.email || 'bạn'}!`,
              timer: 1500,
              showConfirmButton: false,
            });

            // Redirect theo role
            setTimeout(() => {
              if (user?.role === 'ADMIN') {
                navigate('/admin', { replace: true });
              } else if (user?.role === 'LIBRARIAN') {
                navigate('/librarian', { replace: true });
              } else {
                navigate('/', { replace: true });
              }
            }, 1500);
          } catch (userError) {
            console.error('Error fetching user:', userError);
            // Vẫn redirect về home nếu không lấy được user info
            Swal.fire({
              icon: 'success',
              title: 'Đăng nhập thành công!',
              timer: 1500,
              showConfirmButton: false,
            });
            setTimeout(() => navigate('/', { replace: true }), 1500);
          }
        } else {
          setStatus('error');
          Swal.fire({
            icon: 'error',
            title: 'Đăng nhập thất bại',
            text: 'Không thể xác thực với Google. Vui lòng thử lại.',
            confirmButtonColor: '#3b82f6',
          });
          setTimeout(() => navigate('/login', { replace: true }), 2000);
        }
      } catch (error) {
        console.error('OAuth2 callback error:', error);
        setStatus('error');
        Swal.fire({
          icon: 'error',
          title: 'Có lỗi xảy ra',
          text: 'Đã xảy ra lỗi trong quá trình đăng nhập.',
          confirmButtonColor: '#3b82f6',
        });
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      }
    };

    handleCallback();
  }, [navigate, setUser, setIsAuthenticated]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="text-center" style={{
        background: 'white',
        padding: '2rem 3rem',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        {status === 'processing' && (
          <>
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p style={{ fontSize: '1.1rem', color: '#333', margin: 0 }}>Đang xử lý đăng nhập...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <p style={{ fontSize: '1.1rem', color: '#333', margin: 0 }}>Đăng nhập thành công!</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
            <p style={{ fontSize: '1.1rem', color: '#333', margin: 0 }}>Đăng nhập thất bại</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuth2Callback;

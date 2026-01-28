import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Hàm refresh user data
  const refreshUser = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          
          // Lưu userId và user vào localStorage (dùng id từ response)
          const userId = userData.id || userData.userId;
          if (userId) {
            localStorage.setItem('userId', userId);
            localStorage.setItem('user', JSON.stringify(userData));
          }
          
          return userData;
        }
      }
    } catch (error) {
      console.error('Refresh user failed:', error);
      authService.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
    return null;
  };

  // Kiểm tra user khi app load
  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check nếu đang ở OAuth2 callback page
      if (window.location.pathname === '/oauth2/callback') {
        setLoading(false);
        return;
      }

      try {
        await refreshUser();
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.clearTokens();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      
      // Gọi API /user/me để lấy thông tin đầy đủ
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      
      // Lưu userId và user vào localStorage (dùng id từ response)
      const userId = userData.id || userData.userId;
      if (userId) {
        localStorage.setItem('userId', userId);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return { ...data, user: userData };
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = () => {
    authService.googleLogin();
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    googleLogin,
    logout,
    refreshUser, // Export để OAuth2Callback có thể dùng
    setUser,
    setIsAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

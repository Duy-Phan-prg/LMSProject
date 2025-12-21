import { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, logoutApi, saveTokens, clearTokens, isAuthenticated, getUserRole, getUserId } from "../services/authService";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    if (isAuthenticated()) {
      setUser({
        id: getUserId(),
        role: getUserRole(),
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await loginApi({ email, password });
    saveTokens(response);
    setUser({
      id: response.id,
      role: response.role,
    });
    return response;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      clearTokens();
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

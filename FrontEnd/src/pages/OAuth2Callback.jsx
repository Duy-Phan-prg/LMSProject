import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("accessToken");
      const refreshToken = params.get("refreshToken");

      if (accessToken) {
        // ✅ Lưu token
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        console.log("Google login success, token saved!");

        // ✅ Lấy thông tin user (bao gồm role)
        try {
          await refreshUser();
        } catch (error) {
          console.error("Error fetching user:", error);
        }

        // ✅ Redirect về homepage
        navigate("/");
      } else {
        console.log("No token found!");
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate, refreshUser]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <h2>Logging in with Google...</h2>
    </div>
  );
}

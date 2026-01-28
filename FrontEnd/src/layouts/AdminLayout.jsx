import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, BookOpen, FolderTree, ShoppingCart,
  Settings, LogOut, Bell, Search, Menu, X, ChevronDown,
  User, Moon, Sun, HelpCircle, MessageSquare, BarChart3,
  FileText, Calendar, Bookmark, Flag
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAllBorrowings } from "../services/borrowService";
import Swal from "sweetalert2";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Fetch pending borrows count
  const fetchPendingCount = async () => {
    try {
      const response = await getAllBorrowings("", 1, 1000);
      const allBorrows = response.result?.content || response.content || [];
      const pending = allBorrows.filter(
        b => b.status === "PENDING_PICKUP" || b.status === "OVERDUE" || b.status === "EXPIRED_PICKUP"
      );
      setPendingCount(pending.length);
    } catch (error) {
      console.error("Error fetching pending count:", error);
      setPendingCount(0);
    }
  };

  useEffect(() => {
    fetchPendingCount();
    
    // Poll every 30 seconds to update count
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { path: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard", exact: true },
    { path: "/admin/users", icon: <Users size={20} />, label: "Quản lý phân quyền" },
    { path: "/admin/borrow-history", icon: <ShoppingCart size={20} />, label: "Lịch sử mượn" },
    { path: "/admin/reviews", icon: <MessageSquare size={20} />, label: "Quản lý đánh giá" },
    { path: "/admin/reported-reviews", icon: <Flag size={20} />, label: "Tố cáo đánh giá" },
    { path: "/admin/statistics", icon: <BarChart3 size={20} />, label: "Thống kê" },
    { path: "/admin/activity-log", icon: <FileText size={20} />, label: "Log hành động" },
    { path: "/admin/config", icon: <Settings size={20} />, label: "Cấu hình" },
    { path: "/admin/reports", icon: <FileText size={20} />, label: "Báo cáo" },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Đăng xuất?",
      text: "Bạn có chắc muốn đăng xuất khỏi hệ thống?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy"
    });
    
    if (result.isConfirmed) {
      await logout();
      navigate("/login");
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <Link to="/admin" className="sidebar-brand">
            <div className="brand-icon">
              <BookOpen size={24} />
            </div>
            {sidebarOpen && (
              <div className="brand-text">
                <h1>LibraryHub</h1>
                <span>Admin Panel</span>
              </div>
            )}
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            {sidebarOpen && <span className="nav-section-title">MENU CHÍNH</span>}
            <ul>
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-item ${isActive(item.path, item.exact) ? "active" : ""}`}
                    title={item.label}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {sidebarOpen && <span className="nav-label">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav-section">
            {sidebarOpen && <span className="nav-section-title">CÀI ĐẶT</span>}
            <ul>
              <li>
                <Link to="/admin/settings" className="nav-item" title="Cài đặt">
                  <span className="nav-icon"><Settings size={20} /></span>
                  {sidebarOpen && <span className="nav-label">Cài đặt</span>}
                </Link>
              </li>
              <li>
                <Link to="/admin/help" className="nav-item" title="Trợ giúp">
                  <span className="nav-icon"><HelpCircle size={20} /></span>
                  {sidebarOpen && <span className="nav-label">Trợ giúp</span>}
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="header-left">
            <button 
              className="toggle-sidebar-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="header-search">
              <Search size={18} />
              <input type="text" placeholder="Tìm kiếm..." />
            </div>
          </div>

          <div className="header-right">
            <button className="header-btn" title="Tin nhắn">
              <MessageSquare size={20} />
            </button>
            <button 
              className="header-btn" 
              title="Yêu cầu mượn sách"
              onClick={() => navigate("/admin/borrow-history")}
            >
              <Bell size={20} />
              {pendingCount > 0 && <span className="header-badge pulse">{pendingCount}</span>}
            </button>
            
            <div className="header-profile">
              <button 
                className="profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="profile-avatar">
                  <img src="https://ui-avatars.com/api/?name=Admin&background=1e3a5f&color=fff" alt="Admin" />
                </div>
                <div className="profile-info">
                  <span className="profile-name">Admin</span>
                  <span className="profile-role">Quản trị viên</span>
                </div>
                <ChevronDown size={16} />
              </button>
              
              {profileOpen && (
                <div className="profile-dropdown">
                  <Link to="/admin/profile"><User size={16} /> Hồ sơ</Link>
                  <Link to="/admin/settings"><Settings size={16} /> Cài đặt</Link>
                  <hr />
                  <button onClick={handleLogout}>
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

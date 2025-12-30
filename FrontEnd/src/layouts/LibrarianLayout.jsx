import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, FolderTree, ShoppingCart, Users,
  Settings, LogOut, Bell, Search, Menu, X, ChevronDown,
  User, HelpCircle, MessageSquare
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import "../styles/admin.css";

export default function LibrarianLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: "/librarian", icon: <LayoutDashboard size={20} />, label: "Dashboard", exact: true },
    { path: "/librarian/books", icon: <BookOpen size={20} />, label: "Quản lý sách" },
    { path: "/librarian/categories", icon: <FolderTree size={20} />, label: "Danh mục" },
    { path: "/librarian/borrows", icon: <ShoppingCart size={20} />, label: "Mượn/Trả" },
    { path: "/librarian/members", icon: <Users size={20} />, label: "Thành viên" },
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
      confirmButtonColor: "#d4a853",
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
          <Link to="/librarian" className="sidebar-brand">
            <div className="brand-icon">
              <BookOpen size={24} />
            </div>
            {sidebarOpen && (
              <div className="brand-text">
                <h1>LibraryHub</h1>
                <span>Librarian Panel</span>
              </div>
            )}
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            {sidebarOpen && <span className="nav-section-title">QUẢN LÝ THƯ VIỆN</span>}
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
            {sidebarOpen && <span className="nav-section-title">KHÁC</span>}
            <ul>
              <li>
                <Link to="/librarian/help" className={`nav-item ${isActive("/librarian/help") ? "active" : ""}`} title="Trợ giúp">
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
              <input type="text" placeholder="Tìm kiếm sách, thành viên..." />
            </div>
          </div>

          <div className="header-right">
            <button className="header-btn" title="Tin nhắn">
              <MessageSquare size={20} />
            </button>
            <button className="header-btn" title="Thông báo">
              <Bell size={20} />
              <span className="header-badge pulse">2</span>
            </button>
            
            <div className="header-profile">
              <button 
                className="profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="profile-avatar">
                  <img src={`https://ui-avatars.com/api/?name=${user?.fullName || 'Librarian'}&background=d4a853&color=1a2744`} alt="Librarian" />
                </div>
                <div className="profile-info">
                  <span className="profile-name">{user?.fullName || "Librarian"}</span>
                  <span className="profile-role">Thủ thư</span>
                </div>
                <ChevronDown size={16} />
              </button>
              
              {profileOpen && (
                <div className="profile-dropdown">
                  <Link to="/librarian/profile" onClick={() => setProfileOpen(false)}>
                    <User size={16} /> Hồ sơ
                  </Link>
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

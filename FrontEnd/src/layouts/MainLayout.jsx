import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { 
  BookOpen, Search, Bell, User, ChevronRight, Mail, Phone, MapPin,
  ChevronDown, Heart, Bookmark, Menu, X, Home, Grid3X3, Users, Headphones,
  LogOut, Settings, History
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated, clearTokens, getUserRole } from "../services/authService";
import { getUserById } from "../services/userService";
import { useCart } from "../context/CartContext";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cartCount, pendingCount } = useCart();

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        setIsLoggedIn(true);
        const userId = localStorage.getItem("userId");
        if (userId) {
          try {
            const response = await getUserById(userId);
            setCurrentUser(response.result || response);
          } catch (error) {
            console.error("Error fetching user:", error);
          }
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    };
    checkAuth();
  }, [location.pathname]);

  const handleLogout = () => {
    clearTokens();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserDropdownOpen(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const navLinks = [
    { path: "/", label: "Trang chủ", icon: <Home size={18} /> },
    { path: "/books", label: "Sách", icon: <BookOpen size={18} /> },
    { path: "/categories", label: "Thể loại", icon: <Grid3X3 size={18} /> },
    { path: "/authors", label: "Tác giả", icon: <Users size={18} /> },
    { path: "/audiobook", label: "Audiobook", icon: <Headphones size={18} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="main-layout">
      {/* Top Bar */}
      <div className="top-bar">
        <Container>
          <div className="top-bar-content">
            <div className="top-bar-left">
              <span><Phone size={14} /> Hotline: 1900 1234</span>
              <span><Mail size={14} /> contact@libraryhub.vn</span>
            </div>
            <div className="top-bar-right">
              <Link to="/help">Trợ giúp</Link>
              <Link to="/about">Giới thiệu</Link>
              <Link to="/contact">Liên hệ</Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navbar */}
      <nav className="navbar-main">
        <Container>
          <div className="navbar-content">
            {/* Logo */}
            <Link to="/" className="navbar-brand-custom">
              <div className="brand-icon">
                <BookOpen size={24} />
              </div>
              <div className="brand-text">
                <h1>LibraryHub</h1>
                <span>Thư viện số hiện đại</span>
              </div>
            </Link>

            {/* Search Box */}
            <form className="search-box" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Tìm kiếm sách, tác giả, thể loại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <Search size={20} />
              </button>
            </form>

            {/* Nav Actions */}
            <div className="nav-actions">
              <button className="nav-action-btn" title="Yêu thích">
                <Heart size={20} />
              </button>
              <button className="nav-action-btn" title="Sách đã lưu" onClick={() => navigate("/cart")}>
                <Bookmark size={20} />
                {cartCount > 0 && <span className="action-badge">{cartCount}</span>}
              </button>
              <button className="nav-action-btn" title="Thông báo" onClick={() => navigate("/cart?tab=pending")}>
                <Bell size={20} />
                {pendingCount > 0 && <span className="action-badge">{pendingCount}</span>}
              </button>
              {isLoggedIn ? (
                <div className="user-menu-wrapper">
                  <button 
                    className="user-menu-btn"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  >
                    <div className="user-avatar-small">
                      {currentUser?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="user-name-display">{currentUser?.fullName || "User"}</span>
                    <ChevronDown size={16} className={userDropdownOpen ? "rotate" : ""} />
                  </button>
                  {userDropdownOpen && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <div className="user-avatar-large">
                          {currentUser?.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="user-info">
                          <span className="user-fullname">{currentUser?.fullName}</span>
                          <span className="user-email">{currentUser?.email}</span>
                        </div>
                      </div>
                      <div className="user-dropdown-divider"></div>
                      <Link to="/profile" className="user-dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                        <User size={16} /> Tài khoản của tôi
                      </Link>
                      <Link to="/my-borrows" className="user-dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                        <History size={16} /> Lịch sử mượn sách
                      </Link>
                      <Link to="/settings" className="user-dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                        <Settings size={16} /> Cài đặt
                      </Link>
                      <div className="user-dropdown-divider"></div>
                      <button className="user-dropdown-item logout" onClick={handleLogout}>
                        <LogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="login-btn">
                  <User size={18} />
                  <span>Đăng nhập</span>
                </Link>
              )}
              <button 
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </Container>
      </nav>

      {/* Navigation Bar */}
      <div className="nav-bar">
        <Container>
          <div className="nav-bar-content">
            <ul className="nav-links">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="nav-dropdown">
                <button className="nav-link">
                  Thêm <ChevronDown size={16} />
                </button>
                <div className="dropdown-menu">
                  <Link to="/ebook">Ebook</Link>
                  <Link to="/new-releases">Sách mới</Link>
                  <Link to="/bestsellers">Bán chạy</Link>
                  <Link to="/promotions">Khuyến mãi</Link>
                </div>
              </li>
            </ul>
            <div className="nav-bar-right">
              <span className="promo-text">🔥 Miễn phí giao sách cho đơn từ 200k</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <form className="mobile-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={20} />
          </form>
          <ul className="mobile-nav-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={isActive(link.path) ? 'active' : ''}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mobile-menu-footer">
            {isLoggedIn ? (
              <>
                <div className="mobile-user-info">
                  <div className="user-avatar-small">
                    {currentUser?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span>{currentUser?.fullName || "User"}</span>
                </div>
                <button className="mobile-logout-btn" onClick={handleLogout}>
                  <LogOut size={18} /> Đăng xuất
                </button>
              </>
            ) : (
              <Link to="/login" className="mobile-login-btn" onClick={() => setMobileMenuOpen(false)}>
                <User size={18} /> Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer-main">
        <Container>
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <div className="footer-brand">
                <div className="footer-brand-icon">
                  <BookOpen size={24} color="white" />
                </div>
                <h3>LibraryHub</h3>
              </div>
              <p className="footer-description">
                Nền tảng thư viện số hiện đại, mang đến trải nghiệm đọc sách 
                tuyệt vời cho mọi người. Khám phá hàng nghìn đầu sách từ nhiều thể loại.
              </p>
              <div className="footer-contact mt-4">
                <p><Mail size={16} /> contact@libraryhub.vn</p>
                <p><Phone size={16} /> 1900 1234</p>
                <p><MapPin size={16} /> Hà Nội, Việt Nam</p>
              </div>
            </Col>
            <Col lg={2} md={6} className="mb-4">
              <div className="footer-links">
                <h4>Khám phá</h4>
                <ul>
                  <li><Link to="/"><ChevronRight size={14} /> Trang chủ</Link></li>
                  <li><Link to="/books"><ChevronRight size={14} /> Sách mới</Link></li>
                  <li><Link to="/categories"><ChevronRight size={14} /> Thể loại</Link></li>
                  <li><Link to="/authors"><ChevronRight size={14} /> Tác giả</Link></li>
                </ul>
              </div>
            </Col>
            <Col lg={2} md={6} className="mb-4">
              <div className="footer-links">
                <h4>Dịch vụ</h4>
                <ul>
                  <li><Link to="/borrow"><ChevronRight size={14} /> Mượn sách</Link></li>
                  <li><Link to="/ebook"><ChevronRight size={14} /> Ebook</Link></li>
                  <li><Link to="/audiobook"><ChevronRight size={14} /> Audiobook</Link></li>
                  <li><Link to="/membership"><ChevronRight size={14} /> Thành viên</Link></li>
                </ul>
              </div>
            </Col>
            <Col lg={2} md={6} className="mb-4">
              <div className="footer-links">
                <h4>Hỗ trợ</h4>
                <ul>
                  <li><Link to="/help"><ChevronRight size={14} /> Trợ giúp</Link></li>
                  <li><Link to="/faq"><ChevronRight size={14} /> FAQ</Link></li>
                  <li><Link to="/contact"><ChevronRight size={14} /> Liên hệ</Link></li>
                  <li><Link to="/feedback"><ChevronRight size={14} /> Góp ý</Link></li>
                </ul>
              </div>
            </Col>
            <Col lg={2} md={6} className="mb-4">
              <div className="footer-links">
                <h4>Pháp lý</h4>
                <ul>
                  <li><Link to="/terms"><ChevronRight size={14} /> Điều khoản</Link></li>
                  <li><Link to="/privacy"><ChevronRight size={14} /> Bảo mật</Link></li>
                  <li><Link to="/copyright"><ChevronRight size={14} /> Bản quyền</Link></li>
                </ul>
              </div>
            </Col>
          </Row>
          <div className="footer-bottom">
            © 2025 LibraryHub. All rights reserved. Made with ❤️ in Vietnam
          </div>
        </Container>
      </footer>
    </div>
  );
}

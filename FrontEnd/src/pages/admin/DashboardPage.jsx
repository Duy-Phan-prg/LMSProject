import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Users, BookOpen, ShoppingCart, TrendingUp,
  TrendingDown, ArrowUpRight, ArrowDownRight, Calendar, Clock,
  BookMarked, UserCheck, AlertCircle, CheckCircle
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalBorrows: 0,
    totalCategories: 0,
    newUsersToday: 0,
    borrowsToday: 0,
    returnsToday: 0,
    overdueBooks: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [topBooks, setTopBooks] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    // TODO: Gọi API khi backend sẵn sàng
    // try {
    //   const data = await getDashboardStats();
    //   setStats(data.stats);
    //   setRecentActivities(data.recentActivities);
    //   setTopBooks(data.topBooks);
    // } catch (error) {
    //   console.error("Error fetching dashboard:", error);
    // }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getActivityIcon = (type) => {
    switch (type) {
      case "borrow": return <BookMarked size={16} className="text-blue" />;
      case "return": return <CheckCircle size={16} className="text-green" />;
      case "register": return <UserCheck size={16} className="text-purple" />;
      case "overdue": return <AlertCircle size={16} className="text-red" />;
      default: return <Clock size={16} />;
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case "borrow": return <><strong>{activity.user}</strong> đã mượn <strong>{activity.book}</strong></>;
      case "return": return <><strong>{activity.user}</strong> đã trả <strong>{activity.book}</strong></>;
      case "register": return <><strong>{activity.user}</strong> đã đăng ký tài khoản</>;
      case "overdue": return <><strong>{activity.user}</strong> quá hạn trả <strong>{activity.book}</strong></>;
      default: return "";
    }
  };

  return (
    <div className="admin-page dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><LayoutDashboard size={28} /></div>
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Tổng quan hệ thống thư viện</p>
          </div>
        </div>
        <div className="page-header-right">
          <div className="date-display">
            <Calendar size={18} />
            <span>{new Date().toLocaleDateString("vi-VN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card dashboard-stat">
          <div className="stat-card-icon blue"><Users size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.totalUsers.toLocaleString()}</span>
            <span className="stat-card-label">Tổng người dùng</span>
          </div>
          <div className="stat-trend up">
            <ArrowUpRight size={16} /> +{stats.newUsersToday} hôm nay
          </div>
        </div>
        <div className="stat-card dashboard-stat">
          <div className="stat-card-icon green"><BookOpen size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.totalBooks.toLocaleString()}</span>
            <span className="stat-card-label">Tổng sách</span>
          </div>
          <div className="stat-trend up">
            <ArrowUpRight size={16} /> +15 tuần này
          </div>
        </div>
        <div className="stat-card dashboard-stat">
          <div className="stat-card-icon orange"><ShoppingCart size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.totalBorrows.toLocaleString()}</span>
            <span className="stat-card-label">Đang mượn</span>
          </div>
          <div className="stat-trend up">
            <ArrowUpRight size={16} /> +{stats.borrowsToday} hôm nay
          </div>
        </div>
        <div className="stat-card dashboard-stat">
          <div className="stat-card-icon red"><AlertCircle size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.overdueBooks}</span>
            <span className="stat-card-label">Quá hạn</span>
          </div>
          <div className="stat-trend down">
            <ArrowDownRight size={16} /> -3 so với hôm qua
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Activities */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3><Clock size={20} /> Hoạt động gần đây</h3>
            <a href="/admin/borrows" className="card-link">Xem tất cả</a>
          </div>
          <div className="card-body">
            <div className="activity-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                  <div className="activity-content">
                    <p>{getActivityText(activity)}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Books */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3><TrendingUp size={20} /> Sách được mượn nhiều</h3>
            <a href="/admin/books" className="card-link">Xem tất cả</a>
          </div>
          <div className="card-body">
            <div className="top-books-list">
              {topBooks.map((book, index) => (
                <div key={book.id} className="top-book-item">
                  <span className="book-rank">#{index + 1}</span>
                  <img src={book.cover} alt={book.title} className="book-thumb" />
                  <div className="book-info">
                    <h4>{book.title}</h4>
                    <p>{book.author}</p>
                  </div>
                  <span className="book-borrows">{book.borrows} lượt</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="quick-stats-row">
        <div className="quick-stat">
          <div className="quick-stat-icon"><BookMarked size={20} /></div>
          <div className="quick-stat-info">
            <span className="quick-stat-value">{stats.borrowsToday}</span>
            <span className="quick-stat-label">Mượn hôm nay</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-icon"><CheckCircle size={20} /></div>
          <div className="quick-stat-info">
            <span className="quick-stat-value">{stats.returnsToday}</span>
            <span className="quick-stat-label">Trả hôm nay</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-icon"><UserCheck size={20} /></div>
          <div className="quick-stat-info">
            <span className="quick-stat-value">{stats.newUsersToday}</span>
            <span className="quick-stat-label">Đăng ký mới</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-icon"><BookOpen size={20} /></div>
          <div className="quick-stat-info">
            <span className="quick-stat-value">{stats.totalCategories}</span>
            <span className="quick-stat-label">Danh mục</span>
          </div>
        </div>
      </div>
    </div>
  );
}

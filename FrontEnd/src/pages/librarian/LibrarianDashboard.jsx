import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, BookOpen, ShoppingCart, Users,
  ArrowUpRight, ArrowDownRight, Calendar, Clock,
  BookMarked, CheckCircle, AlertCircle, TrendingUp
} from "lucide-react";
import { getAllBooks } from "../../services/bookService";
import { getAllCategories } from "../../services/categoryService";

export default function LibrarianDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalCategories: 0,
    borrowsToday: 0,
    overdueBooks: 0,
    availableBooks: 0,
    outOfStock: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [booksData, categoriesData] = await Promise.all([
        getAllBooks(0, 100),
        getAllCategories(0, 100)
      ]);

      const books = booksData.content || [];
      const categories = categoriesData.content || [];

      setStats({
        totalBooks: books.length,
        totalCategories: categories.filter(c => c.active).length,
        borrowsToday: 0,
        overdueBooks: 0,
        availableBooks: books.filter(b => b.copiesAvailable > 0).length,
        outOfStock: books.filter(b => b.copiesAvailable === 0).length
      });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="admin-page dashboard-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><LayoutDashboard size={28} /></div>
          <div>
            <h1 className="page-title">Librarian Dashboard</h1>
            <p className="page-subtitle">Quản lý thư viện</p>
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
          <div className="stat-card-icon blue"><BookOpen size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{loading ? "..." : stats.totalBooks}</span>
            <span className="stat-card-label">Tổng sách</span>
          </div>
          <div className="stat-trend up">
            <ArrowUpRight size={16} /> {stats.availableBooks} còn sách
          </div>
        </div>
        <div className="stat-card dashboard-stat">
          <div className="stat-card-icon green"><TrendingUp size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{loading ? "..." : stats.totalCategories}</span>
            <span className="stat-card-label">Danh mục</span>
          </div>
        </div>
        <div className="stat-card dashboard-stat">
          <div className="stat-card-icon orange"><ShoppingCart size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.borrowsToday}</span>
            <span className="stat-card-label">Đang mượn</span>
          </div>
        </div>
        <div className="stat-card dashboard-stat">
          <div className="stat-card-icon red"><AlertCircle size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.outOfStock}</span>
            <span className="stat-card-label">Hết sách</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
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
            <span className="quick-stat-value">0</span>
            <span className="quick-stat-label">Trả hôm nay</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-icon"><Users size={20} /></div>
          <div className="quick-stat-info">
            <span className="quick-stat-value">0</span>
            <span className="quick-stat-label">Thành viên</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-icon"><Clock size={20} /></div>
          <div className="quick-stat-info">
            <span className="quick-stat-value">{stats.overdueBooks}</span>
            <span className="quick-stat-label">Quá hạn</span>
          </div>
        </div>
      </div>
    </div>
  );
}

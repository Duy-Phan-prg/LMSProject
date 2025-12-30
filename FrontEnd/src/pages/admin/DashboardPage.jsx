import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Users, BookOpen, ShoppingCart,
  ArrowUpRight, Calendar, Clock, AlertCircle, CheckCircle
} from "lucide-react";
import { getAllUsers } from "../../services/userService";
import { getAllBooks } from "../../services/bookService";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLibrarians: 0,
    totalMembers: 0,
    totalBooks: 0,
    booksAvailable: 0,
    borrowsPending: 0,
    borrowsActive: 0,
    overdueBooks: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersData, booksData] = await Promise.all([
        getAllUsers({ page: 0, size: 1000 }),
        getAllBooks(0, 1000)
      ]);

      const users = usersData.content || [];
      const books = booksData.content || [];

      setStats({
        totalUsers: users.length,
        totalLibrarians: users.filter(u => u.role === "LIBRARIAN").length,
        totalMembers: users.filter(u => u.role === "MEMBER").length,
        totalBooks: books.length,
        booksAvailable: books.filter(b => b.copiesAvailable > 0).length,
        borrowsPending: 0, // TODO: Lấy từ API borrows
        borrowsActive: 0,
        overdueBooks: 0
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
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><LayoutDashboard size={28} /></div>
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Thống kê tổng quan hệ thống</p>
          </div>
        </div>
        <div className="page-header-right">
          <div className="date-display">
            <Calendar size={18} />
            <span>{new Date().toLocaleDateString("vi-VN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards - Row 1: Users */}
      <div className="dashboard-stats">
        <div className="stat-card dashboard-stat">
          <div className="stat-card-icon blue"><Users size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{loading ? "..." : stats.totalUsers}</span>
            <span className="stat-card-label">Tổng người dùng</span>
          </div>
        </div>
        <div className="stat-card dashboard-stat">
          <div className="stat-card-icon orange"><Users size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{loading ? "..." : stats.totalLibrarians}</span>
            <span className="stat-card-label">Librarian</span>
          </div>
        </div>
        <div className="stat-card dashboard-stat">
          <div className="stat-card-icon green"><Users size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{loading ? "..." : stats.totalMembers}</span>
            <span className="stat-card-label">Member</span>
          </div>
        </div>
        <div className="stat-card dashboard-stat">
          <div className="stat-card-icon blue"><BookOpen size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{loading ? "..." : stats.totalBooks}</span>
            <span className="stat-card-label">Tổng sách</span>
          </div>
        </div>
      </div>

      {/* Stats Cards - Row 2: Borrows */}
      <div className="dashboard-stats" style={{marginTop: 20}}>
        <div className="stat-card dashboard-stat">
          <div className="stat-card-icon orange"><Clock size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.borrowsPending}</span>
            <span className="stat-card-label">Yêu cầu PENDING</span>
          </div>
        </div>
        <div className="stat-card dashboard-stat">
          <div className="stat-card-icon green"><ShoppingCart size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.borrowsActive}</span>
            <span className="stat-card-label">Đang mượn</span>
          </div>
        </div>
        <div className="stat-card dashboard-stat">
          <div className="stat-card-icon red"><AlertCircle size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.overdueBooks}</span>
            <span className="stat-card-label">Quá hạn</span>
          </div>
        </div>
        <div className="stat-card dashboard-stat">
          <div className="stat-card-icon green"><CheckCircle size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.booksAvailable}</span>
            <span className="stat-card-label">Sách còn</span>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="dashboard-grid" style={{marginTop: 24}}>
        <div className="dashboard-card">
          <div className="card-header">
            <h3><Users size={20} /> Quản lý Librarian</h3>
            <a href="/admin/librarians" className="card-link">Xem tất cả</a>
          </div>
          <div className="card-body">
            <p style={{color: '#94a3b8', marginBottom: 16}}>
              Admin chỉ quản lý tài khoản Librarian. Librarian sẽ quản lý sách, danh mục, mượn/trả và thành viên.
            </p>
            <div style={{display: 'flex', gap: 16}}>
              <div style={{flex: 1, padding: 16, background: 'rgba(212,168,83,0.1)', borderRadius: 12, textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: 700, color: '#d4a853'}}>{stats.totalLibrarians}</div>
                <div style={{color: '#94a3b8', fontSize: '0.9rem'}}>Librarian</div>
              </div>
              <div style={{flex: 1, padding: 16, background: 'rgba(34,197,94,0.1)', borderRadius: 12, textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: 700, color: '#4ade80'}}>{stats.totalMembers}</div>
                <div style={{color: '#94a3b8', fontSize: '0.9rem'}}>Member</div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3><BookOpen size={20} /> Tổng quan thư viện</h3>
          </div>
          <div className="card-body">
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
              <div style={{padding: 12, background: 'rgba(59,130,246,0.1)', borderRadius: 8}}>
                <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#60a5fa'}}>{stats.totalBooks}</div>
                <div style={{color: '#94a3b8', fontSize: '0.85rem'}}>Tổng sách</div>
              </div>
              <div style={{padding: 12, background: 'rgba(34,197,94,0.1)', borderRadius: 8}}>
                <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#4ade80'}}>{stats.booksAvailable}</div>
                <div style={{color: '#94a3b8', fontSize: '0.85rem'}}>Còn sách</div>
              </div>
              <div style={{padding: 12, background: 'rgba(249,115,22,0.1)', borderRadius: 8}}>
                <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#fb923c'}}>{stats.borrowsPending}</div>
                <div style={{color: '#94a3b8', fontSize: '0.85rem'}}>Chờ duyệt</div>
              </div>
              <div style={{padding: 12, background: 'rgba(239,68,68,0.1)', borderRadius: 8}}>
                <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#f87171'}}>{stats.overdueBooks}</div>
                <div style={{color: '#94a3b8', fontSize: '0.85rem'}}>Quá hạn</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

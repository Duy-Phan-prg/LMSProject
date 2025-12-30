import { useState, useEffect, useCallback } from "react";
import {
  BarChart3, Calendar, TrendingUp, BookOpen, Users, Clock, AlertCircle, RefreshCw
} from "lucide-react";
import { getAllUsers } from "../../services/userService";
import { getAllBooks } from "../../services/bookService";

export default function StatisticsPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalBorrows: 0,
    totalOverdue: 0,
    topBooks: [],
    topUsers: [],
    borrowsByStatus: { pending: 0, borrowing: 0, returned: 0, overdue: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("month");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const [usersData, booksData] = await Promise.all([
        getAllUsers({ page: 0, size: 1000 }),
        getAllBooks(0, 1000)
      ]);

      const users = usersData.content || [];
      const books = booksData.content || [];

      // Sort books by some metric (e.g., copies borrowed = total - available)
      const topBooks = [...books]
        .map(b => ({ ...b, borrowed: (b.copiesTotal || 0) - (b.copiesAvailable || 0) }))
        .sort((a, b) => b.borrowed - a.borrowed)
        .slice(0, 5);

      setStats({
        totalUsers: users.length,
        totalBooks: books.length,
        totalBorrows: 0, // TODO: từ API borrows
        totalOverdue: 0,
        topBooks,
        topUsers: users.slice(0, 5),
        borrowsByStatus: { pending: 0, borrowing: 0, returned: 0, overdue: 0 }
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><BarChart3 size={28} /></div>
          <div>
            <h1 className="page-title">Thống kê chi tiết</h1>
            <p className="page-subtitle">Theo dõi hoạt động thư viện</p>
          </div>
        </div>
        <div className="page-header-right">
          <select className="filter-select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
            <option value="quarter">3 tháng qua</option>
            <option value="year">1 năm qua</option>
          </select>
          <button className="btn-secondary" onClick={fetchStats} disabled={loading}>
            <RefreshCw size={18} className={loading ? "spin" : ""} /> Làm mới
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-icon blue"><Users size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.totalUsers}</span>
            <span className="stat-card-label">Tổng user</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><BookOpen size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.totalBooks}</span>
            <span className="stat-card-label">Tổng sách</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon orange"><Clock size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.totalBorrows}</span>
            <span className="stat-card-label">Lượt mượn</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon red"><AlertCircle size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.totalOverdue}</span>
            <span className="stat-card-label">Quá hạn</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="dashboard-grid" style={{marginTop: 24}}>
        {/* Borrow Status Chart */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3><BarChart3 size={20} /> Trạng thái mượn sách</h3>
          </div>
          <div className="card-body">
            <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                <div style={{width: 100, color: '#94a3b8'}}>Chờ duyệt</div>
                <div style={{flex: 1, height: 24, background: 'rgba(249,115,22,0.2)', borderRadius: 4, overflow: 'hidden'}}>
                  <div style={{width: '0%', height: '100%', background: '#fb923c'}}></div>
                </div>
                <span style={{width: 40, textAlign: 'right', color: '#fb923c', fontWeight: 600}}>{stats.borrowsByStatus.pending}</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                <div style={{width: 100, color: '#94a3b8'}}>Đang mượn</div>
                <div style={{flex: 1, height: 24, background: 'rgba(59,130,246,0.2)', borderRadius: 4, overflow: 'hidden'}}>
                  <div style={{width: '0%', height: '100%', background: '#3b82f6'}}></div>
                </div>
                <span style={{width: 40, textAlign: 'right', color: '#3b82f6', fontWeight: 600}}>{stats.borrowsByStatus.borrowing}</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                <div style={{width: 100, color: '#94a3b8'}}>Đã trả</div>
                <div style={{flex: 1, height: 24, background: 'rgba(34,197,94,0.2)', borderRadius: 4, overflow: 'hidden'}}>
                  <div style={{width: '0%', height: '100%', background: '#22c55e'}}></div>
                </div>
                <span style={{width: 40, textAlign: 'right', color: '#22c55e', fontWeight: 600}}>{stats.borrowsByStatus.returned}</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                <div style={{width: 100, color: '#94a3b8'}}>Quá hạn</div>
                <div style={{flex: 1, height: 24, background: 'rgba(239,68,68,0.2)', borderRadius: 4, overflow: 'hidden'}}>
                  <div style={{width: '0%', height: '100%', background: '#ef4444'}}></div>
                </div>
                <span style={{width: 40, textAlign: 'right', color: '#ef4444', fontWeight: 600}}>{stats.borrowsByStatus.overdue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Books */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3><TrendingUp size={20} /> Top sách được mượn</h3>
          </div>
          <div className="card-body">
            {stats.topBooks.length === 0 ? (
              <p style={{color: '#94a3b8', textAlign: 'center'}}>Chưa có dữ liệu</p>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                {stats.topBooks.map((book, idx) => (
                  <div key={book.bookId} style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <span style={{width: 24, height: 24, background: idx < 3 ? '#d4a853' : '#3d4f7a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: idx < 3 ? '#1a2744' : '#94a3b8'}}>
                      {idx + 1}
                    </span>
                    <div style={{flex: 1, overflow: 'hidden'}}>
                      <div style={{fontWeight: 500, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{book.title}</div>
                      <div style={{fontSize: '0.8rem', color: '#94a3b8'}}>{book.author}</div>
                    </div>
                    <span style={{color: '#d4a853', fontWeight: 600}}>{book.borrowed} lượt</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* More Stats */}
      <div className="dashboard-grid" style={{marginTop: 24}}>
        <div className="dashboard-card">
          <div className="card-header">
            <h3><Users size={20} /> Top user mượn nhiều</h3>
          </div>
          <div className="card-body">
            <p style={{color: '#94a3b8', textAlign: 'center'}}>Cần API thống kê từ backend</p>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3><AlertCircle size={20} /> Top overdue</h3>
          </div>
          <div className="card-body">
            <p style={{color: '#94a3b8', textAlign: 'center'}}>Cần API thống kê từ backend</p>
          </div>
        </div>
      </div>
    </div>
  );
}

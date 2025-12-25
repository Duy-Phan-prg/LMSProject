import { useState, useEffect, useCallback } from "react";
import {
  BarChart3, TrendingUp, TrendingDown, Download, Calendar,
  BookOpen, Users, ShoppingCart, DollarSign
} from "lucide-react";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("month");

  const [stats, setStats] = useState({
    totalBorrows: 0,
    borrowsChange: 0,
    totalReturns: 0,
    returnsChange: 0,
    newUsers: 0,
    usersChange: 0,
    newBooks: 0,
    booksChange: 0,
  });

  const [topBorrowedBooks, setTopBorrowedBooks] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const fetchReportData = useCallback(async () => {
    // TODO: Gọi API khi backend sẵn sàng
    // try {
    //   const data = await getReportStats(dateRange);
    //   setStats(data.stats);
    //   setTopBorrowedBooks(data.topBooks);
    //   setTopCategories(data.categories);
    //   setMonthlyData(data.monthly);
    // } catch (error) {
    //   console.error("Error fetching reports:", error);
    // }
  }, [dateRange]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  return (
    <div className="admin-page reports-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><BarChart3 size={28} /></div>
          <div>
            <h1 className="page-title">Báo cáo thống kê</h1>
            <p className="page-subtitle">Phân tích hoạt động thư viện</p>
          </div>
        </div>
        <div className="page-header-right">
          <select className="filter-select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </select>
          <button className="btn-primary"><Download size={18} /> Xuất báo cáo</button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="stats-cards">
        <div className="stat-card report-stat">
          <div className="stat-card-icon blue"><ShoppingCart size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.totalBorrows.toLocaleString()}</span>
            <span className="stat-card-label">Lượt mượn</span>
          </div>
          <div className={`stat-trend ${stats.borrowsChange >= 0 ? "up" : "down"}`}>
            {stats.borrowsChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(stats.borrowsChange)}%
          </div>
        </div>
        <div className="stat-card report-stat">
          <div className="stat-card-icon green"><BookOpen size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.totalReturns.toLocaleString()}</span>
            <span className="stat-card-label">Lượt trả</span>
          </div>
          <div className={`stat-trend ${stats.returnsChange >= 0 ? "up" : "down"}`}>
            {stats.returnsChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(stats.returnsChange)}%
          </div>
        </div>
        <div className="stat-card report-stat">
          <div className="stat-card-icon orange"><Users size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.newUsers}</span>
            <span className="stat-card-label">Thành viên mới</span>
          </div>
          <div className={`stat-trend ${stats.usersChange >= 0 ? "up" : "down"}`}>
            {stats.usersChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(stats.usersChange)}%
          </div>
        </div>
        <div className="stat-card report-stat">
          <div className="stat-card-icon purple"><BookOpen size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.newBooks}</span>
            <span className="stat-card-label">Sách mới</span>
          </div>
          <div className={`stat-trend ${stats.booksChange >= 0 ? "up" : "down"}`}>
            {stats.booksChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(stats.booksChange)}%
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="reports-grid">
        {/* Monthly Chart */}
        <div className="report-card chart-card">
          <div className="card-header">
            <h3>Thống kê mượn/trả theo tháng</h3>
          </div>
          <div className="card-body">
            <div className="simple-chart">
              {monthlyData.map((data, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bars">
                    <div className="chart-bar borrow" style={{ height: `${(data.borrows / 1300) * 100}%` }} title={`Mượn: ${data.borrows}`}></div>
                    <div className="chart-bar return" style={{ height: `${(data.returns / 1300) * 100}%` }} title={`Trả: ${data.returns}`}></div>
                  </div>
                  <span className="chart-label">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <span><span className="legend-dot borrow"></span> Mượn</span>
              <span><span className="legend-dot return"></span> Trả</span>
            </div>
          </div>
        </div>

        {/* Top Books */}
        <div className="report-card">
          <div className="card-header">
            <h3>Sách được mượn nhiều nhất</h3>
          </div>
          <div className="card-body">
            <div className="top-list">
              {topBorrowedBooks.map((book) => (
                <div key={book.rank} className="top-list-item">
                  <span className="rank">#{book.rank}</span>
                  <span className="title">{book.title}</span>
                  <span className="value">{book.borrows}</span>
                  <span className={`change ${book.change >= 0 ? "up" : "down"}`}>
                    {book.change >= 0 ? "+" : ""}{book.change}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="report-card">
          <div className="card-header">
            <h3>Phân bố theo danh mục</h3>
          </div>
          <div className="card-body">
            <div className="category-bars">
              {topCategories.map((cat, index) => (
                <div key={index} className="category-bar-item">
                  <div className="category-bar-header">
                    <span className="category-name">{cat.name}</span>
                    <span className="category-count">{cat.count} sách ({cat.percentage}%)</span>
                  </div>
                  <div className="category-bar-track">
                    <div className="category-bar-fill" style={{ width: `${cat.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

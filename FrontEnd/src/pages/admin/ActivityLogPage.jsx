import { useState, useEffect } from "react";
import {
  Activity, Search, RefreshCw, AlertCircle, User, BookOpen, Clock, Filter
} from "lucide-react";

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Mock data - TODO: Replace with actual API
  useEffect(() => {
    setLogs([
      // Placeholder - cần API từ backend
    ]);
  }, []);

  const getLogIcon = (type) => {
    switch (type) {
      case "borrow": return <BookOpen size={16} className="text-blue" />;
      case "return": return <BookOpen size={16} className="text-green" />;
      case "user": return <User size={16} className="text-purple" />;
      case "system": return <Activity size={16} className="text-orange" />;
      default: return <Activity size={16} />;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchSearch = log.message?.toLowerCase().includes(searchInput.toLowerCase()) ||
                       log.user?.toLowerCase().includes(searchInput.toLowerCase());
    const matchType = filterType === "all" || log.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><Activity size={28} /></div>
          <div>
            <h1 className="page-title">Log hành động</h1>
            <p className="page-subtitle">Giám sát hoạt động của Librarian và hệ thống</p>
          </div>
        </div>
        <div className="page-header-right">
          <button className="btn-secondary" onClick={() => setLoading(true)} disabled={loading}>
            <RefreshCw size={18} className={loading ? "spin" : ""} /> Làm mới
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-icon blue"><Activity size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{logs.length}</span>
            <span className="stat-card-label">Tổng log</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><BookOpen size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{logs.filter(l => l.type === "borrow").length}</span>
            <span className="stat-card-label">Mượn/Trả</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon orange"><User size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{logs.filter(l => l.type === "user").length}</span>
            <span className="stat-card-label">User</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <div className="search-input">
            <Search size={18} />
            <input type="text" placeholder="Tìm kiếm log..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          </div>
          <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="borrow">Mượn/Trả</option>
            <option value="user">User</option>
            <option value="system">Hệ thống</option>
          </select>
        </div>
      </div>

      {/* Log List */}
      <div className="table-container">
        {loading ? (
          <div className="table-loading"><div className="spinner"></div><p>Đang tải...</p></div>
        ) : filteredLogs.length === 0 ? (
          <div className="table-empty">
            <AlertCircle size={48} />
            <h3>Chưa có log nào</h3>
            <p style={{color: '#94a3b8'}}>Cần tích hợp API log từ backend</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Loại</th>
                <th>Người thực hiện</th>
                <th>Hành động</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={idx}>
                  <td className="date-cell">
                    <Clock size={14} style={{marginRight: 6}} />
                    {log.timestamp}
                  </td>
                  <td>{getLogIcon(log.type)}</td>
                  <td>{log.user}</td>
                  <td>{log.action}</td>
                  <td style={{maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                    {log.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

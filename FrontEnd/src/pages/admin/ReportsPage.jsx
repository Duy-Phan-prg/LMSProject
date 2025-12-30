import { useState } from "react";
import { FileText, Download, Calendar, Filter, RefreshCw, BookOpen, Users, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("borrows");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { value: "borrows", label: "Lịch sử mượn sách", icon: <BookOpen size={18} /> },
    { value: "overdue", label: "Sách quá hạn", icon: <AlertCircle size={18} /> },
    { value: "users", label: "Danh sách user", icon: <Users size={18} /> },
    { value: "books", label: "Danh sách sách", icon: <BookOpen size={18} /> },
  ];

  const handleExport = async (format) => {
    if (!dateFrom || !dateTo) {
      Swal.fire("Lỗi!", "Vui lòng chọn khoảng thời gian", "warning");
      return;
    }

    setLoading(true);
    try {
      // TODO: Gọi API xuất báo cáo
      await new Promise(resolve => setTimeout(resolve, 1500));
      Swal.fire("Thành công!", `Đã xuất báo cáo ${format.toUpperCase()}`, "success");
    } catch (error) {
      Swal.fire("Lỗi!", "Không thể xuất báo cáo", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><FileText size={28} /></div>
          <div>
            <h1 className="page-title">Báo cáo</h1>
            <p className="page-subtitle">Xuất báo cáo Excel / CSV</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Report Type Selection */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3><Filter size={20} /> Chọn loại báo cáo</h3>
          </div>
          <div className="card-body">
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              {reportTypes.map(type => (
                <label
                  key={type.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                    background: reportType === type.value ? 'rgba(212,168,83,0.15)' : 'rgba(45,58,92,0.5)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    border: reportType === type.value ? '1px solid rgba(212,168,83,0.5)' : '1px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={type.value}
                    checked={reportType === type.value}
                    onChange={(e) => setReportType(e.target.value)}
                    style={{display: 'none'}}
                  />
                  <span style={{color: reportType === type.value ? '#d4a853' : '#94a3b8'}}>{type.icon}</span>
                  <span style={{color: reportType === type.value ? '#e2e8f0' : '#94a3b8', fontWeight: reportType === type.value ? 600 : 400}}>
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Date Range & Export */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3><Calendar size={20} /> Khoảng thời gian</h3>
          </div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <label>Từ ngày</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Đến ngày</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            <div style={{display: 'flex', gap: 12, marginTop: 24}}>
              <button
                className="btn-primary"
                onClick={() => handleExport('excel')}
                disabled={loading}
                style={{flex: 1}}
              >
                {loading ? <RefreshCw size={18} className="spin" /> : <Download size={18} />}
                Xuất Excel
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleExport('csv')}
                disabled={loading}
                style={{flex: 1}}
              >
                <Download size={18} />
                Xuất CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reports */}
      <div style={{marginTop: 24}}>
        <h3 style={{color: '#e2e8f0', marginBottom: 16, fontFamily: 'Playfair Display, serif'}}>Báo cáo nhanh</h3>
        <div className="stats-cards">
          <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => { setReportType('borrows'); setDateFrom(new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0]); setDateTo(new Date().toISOString().split('T')[0]); }}>
            <div className="stat-card-icon blue"><BookOpen size={24} /></div>
            <div className="stat-card-info">
              <span className="stat-card-label">Mượn sách 7 ngày qua</span>
            </div>
          </div>
          <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => { setReportType('overdue'); setDateFrom(new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0]); setDateTo(new Date().toISOString().split('T')[0]); }}>
            <div className="stat-card-icon red"><AlertCircle size={24} /></div>
            <div className="stat-card-info">
              <span className="stat-card-label">Quá hạn tháng này</span>
            </div>
          </div>
          <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => { setReportType('users'); setDateFrom('2020-01-01'); setDateTo(new Date().toISOString().split('T')[0]); }}>
            <div className="stat-card-icon green"><Users size={24} /></div>
            <div className="stat-card-info">
              <span className="stat-card-label">Tất cả user</span>
            </div>
          </div>
          <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => { setReportType('books'); setDateFrom('2020-01-01'); setDateTo(new Date().toISOString().split('T')[0]); }}>
            <div className="stat-card-icon orange"><BookOpen size={24} /></div>
            <div className="stat-card-info">
              <span className="stat-card-label">Tất cả sách</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

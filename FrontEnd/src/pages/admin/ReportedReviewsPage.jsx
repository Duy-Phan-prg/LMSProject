import { useState, useEffect } from "react";
import { Flag, Search, Eye, Trash2, CheckCircle, XCircle, AlertTriangle, Calendar, User, BookOpen, Star } from "lucide-react";
import { getViolatedReviews } from "../../services/reportService";
import { deleteReview } from "../../services/reviewService";
import Swal from "sweetalert2";

export default function ReportedReviewsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingReport, setViewingReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getViolatedReviews();
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      Swal.fire("Lỗi!", "Không thể tải danh sách tố cáo", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (report) => {
    const result = await Swal.fire({
      title: "Xóa đánh giá vi phạm?",
      html: `
        <div style="text-align: left;">
          <p><strong>Người viết đánh giá:</strong> ${report.reviewAuthor}</p>
          <p><strong>Nội dung:</strong> "${report.reviewContent}"</p>
          <p><strong>Người tố cáo:</strong> ${report.reportedBy}</p>
          <p><strong>Lý do:</strong> ${report.reason}</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Xóa đánh giá",
      cancelButtonText: "Hủy"
    });

    if (result.isConfirmed) {
      try {
        const adminId = localStorage.getItem("userId");
        await deleteReview(report.reviewId, adminId);
        
        Swal.fire("Đã xóa!", "Đánh giá vi phạm đã được xóa", "success");
        fetchReports();
      } catch (error) {
        console.error("Error deleting review:", error);
        Swal.fire("Lỗi!", error.response?.data?.message || "Không thể xóa đánh giá", "error");
      }
    }
  };

  const handleIgnoreReport = async (report) => {
    const result = await Swal.fire({
      title: "Bỏ qua tố cáo?",
      text: "Đánh giá này sẽ được giữ lại",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "Bỏ qua",
      cancelButtonText: "Hủy"
    });

    if (result.isConfirmed) {
      Swal.fire("Đã bỏ qua!", "Tố cáo đã được đánh dấu", "success");
      fetchReports();
    }
  };

  const filteredReports = reports.filter(report =>
    report.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reportedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reviewAuthor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reviewContent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("vi-VN");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <span className="status-badge pending"><AlertTriangle size={14} /> Chờ xử lý</span>;
      case "APPROVED":
        return <span className="status-badge violated"><XCircle size={14} /> Vi phạm</span>;
      case "REJECTED":
        return <span className="status-badge resolved"><CheckCircle size={14} /> Đã bỏ qua</span>;
      default:
        return <span className="status-badge pending">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-title-section">
          <Flag size={32} />
          <div>
            <h1>Quản lý đánh giá bị tố cáo</h1>
            <p>Xem xét và xử lý các đánh giá vi phạm</p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon red">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-value">{reports.length}</span>
            <span className="stat-card-label">Tổng tố cáo</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon orange">
            <Flag size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-value">{reports.filter(r => r.status === "PENDING").length}</span>
            <span className="stat-card-label">Chờ xử lý</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-value">{reports.filter(r => r.status === "APPROVED").length}</span>
            <span className="stat-card-label">Đã xác nhận</span>
          </div>
        </div>
      </div>

      <div className="page-controls">
        <div className="search-box-admin">
          <Search size={18} />
          <input
            type="text"
            placeholder="Tìm theo sách, người tố cáo, người viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="empty-state">
          <Flag size={64} />
          <h3>Không có tố cáo nào</h3>
          <p>Chưa có đánh giá nào bị tố cáo</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sách</th>
                <th>Nội dung</th>
                <th>Sao</th>
                <th>Người viết</th>
                <th>Người tố cáo</th>
                <th>Lý do</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.reviewId}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <strong>{report.bookTitle}</strong>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{report.isbn}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {report.reviewContent}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <span>{report.rating}</span>
                    </div>
                  </td>
                  <td>{report.reviewAuthor}</td>
                  <td>{report.reportedBy}</td>
                  <td>
                    <span className="reason-badge">{report.reason}</span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    {formatDate(report.reportedAt)}
                  </td>
                  <td>
                    {getStatusBadge(report.status)}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-view"
                        onClick={() => setViewingReport(report)}
                        title="Xem"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDeleteReview(report)}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        className="btn-icon btn-success"
                        onClick={() => handleIgnoreReport(report)}
                        title="Bỏ qua"
                      >
                        <CheckCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewingReport && (
        <div className="modal-overlay" onClick={() => setViewingReport(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết tố cáo</h2>
              <button className="modal-close" onClick={() => setViewingReport(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4><BookOpen size={18} /> Thông tin sách</h4>
                <div className="detail-row">
                  <span className="detail-label">Tên sách:</span>
                  <span className="detail-value">{viewingReport.bookTitle}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ISBN:</span>
                  <span className="detail-value">{viewingReport.isbn}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4><Star size={18} /> Đánh giá</h4>
                <div className="detail-row">
                  <span className="detail-label">Người viết:</span>
                  <span className="detail-value">{viewingReport.reviewAuthor}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Đánh giá:</span>
                  <span className="detail-value">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < viewingReport.rating ? "#f59e0b" : "none"}
                        color="#f59e0b"
                      />
                    ))}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Nội dung:</span>
                  <span className="detail-value">{viewingReport.reviewContent}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4><Flag size={18} /> Tố cáo</h4>
                <div className="detail-row">
                  <span className="detail-label">Người tố cáo:</span>
                  <span className="detail-value">{viewingReport.reportedBy}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Lý do:</span>
                  <span className="detail-value reason-badge">{viewingReport.reason}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Thời gian:</span>
                  <span className="detail-value">{formatDate(viewingReport.reportedAt)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Trạng thái:</span>
                  <span className="detail-value">{getStatusBadge(viewingReport.status)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setViewingReport(null)}>Đóng</button>
              <button className="btn-danger" onClick={() => {
                setViewingReport(null);
                handleDeleteReview(viewingReport);
              }}>
                <Trash2 size={16} /> Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .reason-badge {
          display: inline-block;
          padding: 4px 10px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .status-badge.violated {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        .status-badge.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }
        .status-badge.resolved {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }
        .btn-success {
          color: #22c55e;
        }
        .btn-success:hover {
          background: rgba(34, 197, 94, 0.1);
        }
        .detail-section {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .detail-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .detail-section h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #d4a853;
          margin-bottom: 16px;
          font-size: 1rem;
        }
        .btn-danger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-danger:hover {
          background: #dc2626;
        }
      `}</style>
    </div>
  );
}

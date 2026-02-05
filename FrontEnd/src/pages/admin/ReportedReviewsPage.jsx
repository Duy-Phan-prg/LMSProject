import { useState, useEffect } from "react";
import { Flag, Search, Eye, Trash2, CheckCircle, XCircle, AlertTriangle, Calendar, User, BookOpen, Star } from "lucide-react";
import { getReportsByStatus, updateReportStatus } from "../../services/reportService";
import { deleteReview } from "../../services/reviewService";
import Swal from "sweetalert2";
import "./ReportedReviewsPage.css";

export default function ReportedReviewsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingReport, setViewingReport] = useState(null);
  const [statusFilter, setStatusFilter] = useState("PENDING");

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getReportsByStatus(statusFilter);
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

  const handleUpdateStatus = async (report) => {
    const { value: status } = await Swal.fire({
      title: "Xử lý tố cáo",
      html: `
        <div style="text-align: left; margin-bottom: 16px;">
          <p><strong>Sách:</strong> ${report.bookTitle}</p>
          <p><strong>Người viết:</strong> ${report.reviewAuthor}</p>
          <p><strong>Nội dung:</strong> "${report.reviewContent}"</p>
          <p><strong>Người tố cáo:</strong> ${report.reportedBy}</p>
          <p><strong>Lý do:</strong> ${report.reason}</p>
        </div>
      `,
      input: "select",
      inputOptions: {
        VIOLATED: "Vi phạm - Xác nhận đánh giá vi phạm",
        IGNORED: "Bỏ qua - Đánh giá hợp lệ"
      },
      inputPlaceholder: "Chọn trạng thái",
      showCancelButton: true,
      confirmButtonColor: "#d4a853",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      inputValidator: (value) => {
        if (!value) {
          return "Vui lòng chọn trạng thái";
        }
      }
    });

    if (status) {
      try {
        await updateReportStatus(report.reportId, status);
        const message = status === "VIOLATED" 
          ? "Đã xác nhận vi phạm" 
          : "Đã bỏ qua tố cáo";
        Swal.fire("Thành công!", message, "success");
        fetchReports();
      } catch (error) {
        console.error("Error updating report status:", error);
        Swal.fire("Lỗi!", "Không thể cập nhật trạng thái", "error");
      }
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
      case "VIOLATED":
        return <span className="status-badge violated"><XCircle size={14} /> Vi phạm</span>;
      case "IGNORED":
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
    <div className="admin-page compact-page">
      <div className="page-header compact-header">
        <div className="page-title-section">
          <Flag size={24} />
          <div>
            <h1>Quản lý đánh giá bị tố cáo</h1>
          </div>
        </div>
        <div className="header-stats">
          <span className="stat-badge red"><AlertTriangle size={14} /> {reports.length}</span>
          <span className="stat-badge orange"><Flag size={14} /> {reports.filter(r => r.status === "PENDING").length}</span>
          <span className="stat-badge green"><CheckCircle size={14} /> {reports.filter(r => r.status === "VIOLATED").length}</span>
        </div>
      </div>

      <div className="page-controls compact-controls">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${statusFilter === "PENDING" ? "active" : ""}`}
            onClick={() => setStatusFilter("PENDING")}
          >
            <AlertTriangle size={16} /> Chờ xử lý
          </button>
          <button 
            className={`filter-tab ${statusFilter === "VIOLATED" ? "active" : ""}`}
            onClick={() => setStatusFilter("VIOLATED")}
          >
            <XCircle size={16} /> Vi phạm
          </button>
          <button 
            className={`filter-tab ${statusFilter === "IGNORED" ? "active" : ""}`}
            onClick={() => setStatusFilter("IGNORED")}
          >
            <CheckCircle size={16} /> Đã bỏ qua
          </button>
        </div>
        <div className="search-box-admin">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="empty-state compact-empty">
          <Flag size={48} />
          <h3>Không có tố cáo</h3>
        </div>
      ) : (
        <div className="table-container compact-table">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sách</th>
                <th>Nội dung</th>
                <th style={{ width: '60px' }}>Sao</th>
                <th>Người viết</th>
                <th>Người tố cáo</th>
                <th>Lý do</th>
                <th style={{ width: '100px' }}>Thời gian</th>
                <th style={{ width: '100px' }}>Trạng thái</th>
                <th style={{ width: '200px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.reviewId}>
                  <td>
                    <div className="book-cell">
                      <strong>{report.bookTitle}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="content-cell">
                      {report.reviewContent}
                    </div>
                  </td>
                  <td>
                    <div className="rating-compact">
                      <Star size={12} fill="#f59e0b" color="#f59e0b" />
                      {report.rating}
                    </div>
                  </td>
                  <td>{report.reviewAuthor}</td>
                  <td>{report.reportedBy}</td>
                  <td>
                    <span className="reason-badge">{report.reason}</span>
                  </td>
                  <td className="date-cell">
                    {new Date(report.reportedAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    {getStatusBadge(report.status)}
                  </td>
                  <td>
                    <div className="action-buttons compact-actions">
                      <button
                        className="btn-action btn-view"
                        onClick={() => setViewingReport(report)}
                        title="Xem chi tiết"
                      >
                        <Eye size={14} />
                        <span>Xem</span>
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteReview(report)}
                        title="Xóa đánh giá"
                      >
                        <Trash2 size={14} />
                        <span>Xóa</span>
                      </button>
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleUpdateStatus(report)}
                        title="Xử lý tố cáo"
                      >
                        <CheckCircle size={14} />
                        <span>Xử lý</span>
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
    </div>
  );
}

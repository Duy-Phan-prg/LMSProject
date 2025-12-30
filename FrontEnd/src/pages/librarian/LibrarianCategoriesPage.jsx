import { useState, useEffect, useCallback } from "react";
import {
  Layers, Plus, Search, Edit, Trash2,
  ChevronLeft, ChevronRight, RefreshCw, AlertCircle, X
} from "lucide-react";
import Swal from "sweetalert2";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoryService";

export default function LibrarianCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllCategories(currentPage, pageSize);
      setCategories(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Swal.fire("Lỗi!", "Không thể tải danh sách danh mục", "error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (categoryId) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc muốn xóa danh mục này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy"
    });
    if (result.isConfirmed) {
      try {
        await deleteCategory(categoryId);
        Swal.fire("Thành công!", "Đã xóa danh mục.", "success");
        fetchCategories();
      } catch (error) {
        Swal.fire("Lỗi!", error.response?.data?.message || "Không thể xóa danh mục", "error");
      }
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.categoryName?.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="admin-page categories-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><Layers size={28} /></div>
          <div>
            <h1 className="page-title">Quản lý danh mục</h1>
            <p className="page-subtitle">Thêm, sửa, xóa danh mục sách</p>
          </div>
        </div>
        <div className="page-header-right">
          <button className="btn-secondary" onClick={fetchCategories} disabled={loading}>
            <RefreshCw size={18} className={loading ? "spin" : ""} /> Làm mới
          </button>
          <button className="btn-primary" onClick={() => { setEditingCategory(null); setShowModal(true); }}>
            <Plus size={18} /> Thêm danh mục
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-icon blue"><Layers size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{totalElements}</span>
            <span className="stat-card-label">Tổng danh mục</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><Layers size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{categories.filter(c => c.active).length}</span>
            <span className="stat-card-label">Đang hoạt động</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon red"><Layers size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{categories.filter(c => !c.active).length}</span>
            <span className="stat-card-label">Đã ẩn</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <div className="search-input">
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên danh mục..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="table-loading"><div className="spinner"></div><p>Đang tải...</p></div>
        ) : filteredCategories.length === 0 ? (
          <div className="table-empty"><AlertCircle size={48} /><h3>Không có dữ liệu</h3></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th className="th-actions">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => (
                <tr key={cat.categoryId}>
                  <td><strong>#{cat.categoryId}</strong></td>
                  <td>{cat.categoryName}</td>
                  <td style={{maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                    {cat.description || "—"}
                  </td>
                  <td>
                    <span className={`status-badge ${cat.active ? "active" : "inactive"}`}>
                      {cat.active ? "Hoạt động" : "Đã ẩn"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" onClick={() => { setEditingCategory(cat); setShowModal(true); }}><Edit size={16} /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(cat.categoryId)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredCategories.length > 0 && (
        <div className="table-pagination">
          <div className="pagination-info">Hiển thị {filteredCategories.length} / {totalElements} danh mục</div>
          <div className="pagination-controls">
            <select className="page-size-select" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
            </select>
            <div className="pagination-buttons">
              <button className="pagination-btn" disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={18} /></button>
              <span className="pagination-btn active">{currentPage + 1}</span>
              <button className="pagination-btn" disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => { setShowModal(false); setEditingCategory(null); }}
          onSuccess={fetchCategories}
        />
      )}
    </div>
  );
}

function CategoryFormModal({ category, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    categoryName: category?.categoryName || "",
    description: category?.description || "",
    active: category?.active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.categoryName.trim()) newErrors.categoryName = "Tên danh mục không được để trống";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        categoryName: formData.categoryName.trim(),
        description: formData.description.trim() || null,
        active: formData.active,
      };

      if (category) {
        await updateCategory(category.categoryId, payload);
        Swal.fire("Thành công!", "Đã cập nhật danh mục", "success");
      } else {
        await createCategory(payload);
        Swal.fire("Thành công!", "Đã thêm danh mục mới", "success");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      Swal.fire("Lỗi!", error.response?.data?.message || "Không thể lưu danh mục", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Tên danh mục <span className="required">*</span></label>
              <input
                type="text"
                value={formData.categoryName}
                onChange={e => setFormData({...formData, categoryName: e.target.value})}
                placeholder="Nhập tên danh mục"
                className={errors.categoryName ? "input-error" : ""}
              />
              {errors.categoryName && <span className="error-text">{errors.categoryName}</span>}
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Nhập mô tả danh mục"
              ></textarea>
            </div>
            <div className="form-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={e => setFormData({...formData, active: e.target.checked})}
                />
                <span>Kích hoạt danh mục</span>
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Đang xử lý..." : (category ? "Cập nhật" : "Thêm mới")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

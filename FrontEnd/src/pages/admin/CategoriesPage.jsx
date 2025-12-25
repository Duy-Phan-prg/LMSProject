import { useState, useEffect } from "react";
import {
  FolderTree, Plus, Search, Edit, Trash2,
  ChevronLeft, ChevronRight, RefreshCw, AlertCircle, X, BookOpen
} from "lucide-react";
import Swal from "sweetalert2";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../../services/categoryService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories(page, size, keyword);
      setCategories(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Swal.fire("Lỗi!", "Không thể tải danh sách danh mục", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, keyword]);

  const handleSearch = () => {
    setPage(0);
    setKeyword(searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: `Bạn có chắc muốn xóa danh mục "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy"
    });
    
    if (result.isConfirmed) {
      try {
        await deleteCategory(id);
        Swal.fire("Thành công!", "Đã xóa danh mục.", "success");
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        Swal.fire("Lỗi!", error.response?.data?.message || "Không thể xóa danh mục", "error");
      }
    }
  };

  const handleFormSuccess = () => {
    setShowModal(false);
    setEditingCategory(null);
    fetchCategories();
  };

  const activeCount = categories.filter(c => c.active).length;

  return (
    <div className="admin-page categories-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><FolderTree size={28} /></div>
          <div>
            <h1 className="page-title">Quản lý danh mục</h1>
            <p className="page-subtitle">Quản lý các danh mục sách trong thư viện</p>
          </div>
        </div>
        <div className="page-header-right">
          <button className="btn-secondary" onClick={fetchCategories}>
            <RefreshCw size={18} /> Làm mới
          </button>
          <button className="btn-primary" onClick={() => { setEditingCategory(null); setShowModal(true); }}>
            <Plus size={18} /> Thêm danh mục
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-icon blue"><FolderTree size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{totalElements}</span>
            <span className="stat-card-label">Tổng danh mục</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><BookOpen size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{activeCount}</span>
            <span className="stat-card-label">Đang hoạt động</span>
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
              placeholder="Tìm kiếm danh mục..." 
              value={searchInput} 
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <button className="btn-secondary" onClick={handleSearch}>Tìm kiếm</button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid">
        {loading ? (
          <div className="table-loading"><div className="spinner"></div><p>Đang tải...</p></div>
        ) : categories.length === 0 ? (
          <div className="table-empty"><AlertCircle size={48} /><h3>Không có danh mục</h3></div>
        ) : (
          categories.map((category) => (
            <div key={category.categoryId} className={`category-card ${!category.active ? "inactive" : ""}`}>
              <div className="category-card-header">
                <div className="category-icon"><FolderTree size={24} /></div>
                <div className="category-actions">
                  <button className="action-btn edit" onClick={() => { setEditingCategory(category); setShowModal(true); }}>
                    <Edit size={16} />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(category.categoryId, category.categoryName)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="category-name">{category.categoryName}</h3>
              <p className="category-desc">{category.categoryDescription || "Chưa có mô tả"}</p>
              <div className="category-footer">
                <span className={`status-badge ${category.active ? "active" : "inactive"}`}>
                  {category.active ? "Hoạt động" : "Tạm ẩn"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn" 
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="pagination-info">
            Trang {page + 1} / {totalPages}
          </span>
          <button 
            className="pagination-btn" 
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CategoryFormModal 
          category={editingCategory} 
          onClose={() => { setShowModal(false); setEditingCategory(null); }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

function CategoryFormModal({ category, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    categoryName: category?.categoryName || "",
    categoryDescription: category?.categoryDescription || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.categoryName.trim()) {
      newErrors.categoryName = "Vui lòng nhập tên danh mục";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (category) {
        await updateCategory(category.categoryId, formData);
        Swal.fire("Thành công!", "Đã cập nhật danh mục", "success");
      } else {
        await createCategory(formData);
        Swal.fire("Thành công!", "Đã thêm danh mục mới", "success");
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving category:", error);
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
                className={errors.categoryName ? "input-error" : ""}
                placeholder="Nhập tên danh mục"
              />
              {errors.categoryName && <span className="error-text">{errors.categoryName}</span>}
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea 
                rows="3" 
                value={formData.categoryDescription} 
                onChange={e => setFormData({...formData, categoryDescription: e.target.value})}
                placeholder="Nhập mô tả danh mục (không bắt buộc)"
              ></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Đang xử lý..." : (category ? "Cập nhật" : "Thêm mới")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

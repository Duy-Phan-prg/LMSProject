import { useState, useEffect } from "react";
import {
  FolderTree, Plus, Search, Edit, Trash2, Eye,
  ChevronLeft, ChevronRight, RefreshCw, AlertCircle, X, BookOpen
} from "lucide-react";
import Swal from "sweetalert2";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCategories([
        { categoryId: 1, categoryName: "Văn học", categoryDescription: "Sách văn học trong và ngoài nước", bookCount: 245, active: true },
        { categoryId: 2, categoryName: "Kinh tế", categoryDescription: "Sách về kinh tế, tài chính, đầu tư", bookCount: 189, active: true },
        { categoryId: 3, categoryName: "Kỹ năng sống", categoryDescription: "Sách phát triển bản thân", bookCount: 156, active: true },
        { categoryId: 4, categoryName: "Khoa học", categoryDescription: "Sách khoa học tự nhiên và xã hội", bookCount: 134, active: true },
        { categoryId: 5, categoryName: "Lịch sử", categoryDescription: "Sách lịch sử Việt Nam và thế giới", bookCount: 98, active: true },
        { categoryId: 6, categoryName: "Thiếu nhi", categoryDescription: "Sách dành cho trẻ em", bookCount: 87, active: true },
        { categoryId: 7, categoryName: "Tâm lý", categoryDescription: "Sách tâm lý học", bookCount: 76, active: false },
        { categoryId: 8, categoryName: "Triết học", categoryDescription: "Sách triết học đông tây", bookCount: 54, active: true },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleDelete = async (id) => {
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
      setCategories(prev => prev.filter(c => c.categoryId !== id));
      Swal.fire("Thành công!", "Đã xóa danh mục.", "success");
    }
  };

  const filteredCategories = categories.filter(c => 
    c.categoryName.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="admin-page categories-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><FolderTree size={28} /></div>
          <div>
            <h1 className="page-title">Quản lý danh mục</h1>
            <p className="page-subtitle">Quản lý các danh mục sách</p>
          </div>
        </div>
        <div className="page-header-right">
          <button className="btn-secondary"><RefreshCw size={18} /> Làm mới</button>
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
            <span className="stat-card-value">{categories.length}</span>
            <span className="stat-card-label">Tổng danh mục</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><BookOpen size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{categories.reduce((sum, c) => sum + c.bookCount, 0)}</span>
            <span className="stat-card-label">Tổng sách</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <div className="search-input">
            <Search size={18} />
            <input type="text" placeholder="Tìm kiếm danh mục..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid">
        {loading ? (
          <div className="table-loading"><div className="spinner"></div><p>Đang tải...</p></div>
        ) : filteredCategories.length === 0 ? (
          <div className="table-empty"><AlertCircle size={48} /><h3>Không có danh mục</h3></div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.categoryId} className={`category-card ${!category.active ? "inactive" : ""}`}>
              <div className="category-card-header">
                <div className="category-icon"><FolderTree size={24} /></div>
                <div className="category-actions">
                  <button className="action-btn edit" onClick={() => { setEditingCategory(category); setShowModal(true); }}><Edit size={16} /></button>
                  <button className="action-btn delete" onClick={() => handleDelete(category.categoryId)}><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="category-name">{category.categoryName}</h3>
              <p className="category-desc">{category.categoryDescription}</p>
              <div className="category-footer">
                <span className="book-count"><BookOpen size={14} /> {category.bookCount} sách</span>
                <span className={`status-dot ${category.active ? "active" : "inactive"}`}></span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <CategoryFormModal 
          category={editingCategory} 
          onClose={() => { setShowModal(false); setEditingCategory(null); }}
          onSuccess={(data) => {
            if (editingCategory) {
              setCategories(prev => prev.map(c => c.categoryId === editingCategory.categoryId ? {...c, ...data} : c));
            } else {
              setCategories(prev => [...prev, { categoryId: Date.now(), ...data, bookCount: 0, active: true }]);
            }
            setShowModal(false);
            setEditingCategory(null);
          }}
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess(formData);
    Swal.fire("Thành công!", category ? "Đã cập nhật danh mục" : "Đã thêm danh mục mới", "success");
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
              <input type="text" value={formData.categoryName} onChange={e => setFormData({...formData, categoryName: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea rows="3" value={formData.categoryDescription} onChange={e => setFormData({...formData, categoryDescription: e.target.value})}></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-primary">{category ? "Cập nhật" : "Thêm mới"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

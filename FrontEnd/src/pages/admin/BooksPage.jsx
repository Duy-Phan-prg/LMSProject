import { useState, useEffect, useCallback } from "react";
import {
  BookOpen, Plus, Search, Download, Upload,
  Edit, Trash2, Eye, ChevronLeft, ChevronRight,
  RefreshCw, AlertCircle, X, Calendar, FileText, Image
} from "lucide-react";
import Swal from "sweetalert2";
import { getAllBooks, deleteBook, createBook, updateBook } from "../../services/bookService";
import { getAllCategories } from "../../services/categoryService";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [viewingBook, setViewingBook] = useState(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllBooks(currentPage, pageSize);
      setBooks(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching books:", error);
      Swal.fire("Lỗi!", "Không thể tải danh sách sách", "error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories(0, 100);
      setCategories(data.content || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [fetchBooks]);

  const handleDelete = async (bookId) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc muốn xóa sách này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy"
    });
    if (result.isConfirmed) {
      try {
        await deleteBook(bookId);
        Swal.fire("Thành công!", "Đã xóa sách.", "success");
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
        Swal.fire("Lỗi!", error.response?.data?.message || "Không thể xóa sách", "error");
      }
    }
  };

  const handleSelectAll = (e) => {
    setSelectedBooks(e.target.checked ? books.map(b => b.bookId) : []);
  };

  const handleSelectBook = (bookId) => {
    setSelectedBooks(prev => prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]);
  };

  return (
    <div className="admin-page books-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><BookOpen size={28} /></div>
          <div>
            <h1 className="page-title">Quản lý sách</h1>
            <p className="page-subtitle">Quản lý tất cả sách trong thư viện</p>
          </div>
        </div>
        <div className="page-header-right">
          <button className="btn-secondary" onClick={fetchBooks} disabled={loading}>
            <RefreshCw size={18} className={loading ? "spin" : ""} /> Làm mới
          </button>
          <button className="btn-primary" onClick={() => { setEditingBook(null); setShowModal(true); }}>
            <Plus size={18} /> Thêm sách
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-icon blue"><BookOpen size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{totalElements}</span>
            <span className="stat-card-label">Tổng sách</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><FileText size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{books.filter(b => b.active).length}</span>
            <span className="stat-card-label">Đang hoạt động</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon orange"><AlertCircle size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{books.filter(b => b.copiesAvailable === 0).length}</span>
            <span className="stat-card-label">Hết sách</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon red"><Trash2 size={24} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{books.filter(b => !b.active).length}</span>
            <span className="stat-card-label">Đã ẩn</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <div className="search-input">
            <Search size={18} />
            <input type="text" placeholder="Tìm kiếm theo tên, tác giả, ISBN..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          </div>
        </div>
        <div className="toolbar-right">
          {selectedBooks.length > 0 && <span className="selected-count">Đã chọn {selectedBooks.length}</span>}
          <button className="btn-icon" title="Xuất Excel"><Download size={18} /></button>
          <button className="btn-icon" title="Nhập dữ liệu"><Upload size={18} /></button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="table-loading"><div className="spinner"></div><p>Đang tải...</p></div>
        ) : books.length === 0 ? (
          <div className="table-empty"><AlertCircle size={48} /><h3>Không có dữ liệu</h3></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th className="th-checkbox"><input type="checkbox" checked={selectedBooks.length === books.length} onChange={handleSelectAll} /></th>
                <th>Sách</th>
                <th>ISBN</th>
                <th>Tác giả</th>
                <th>Năm XB</th>
                <th>Số lượng</th>
                <th>Trạng thái</th>
                <th className="th-actions">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.bookId} className={selectedBooks.includes(book.bookId) ? "selected" : ""}>
                  <td><input type="checkbox" checked={selectedBooks.includes(book.bookId)} onChange={() => handleSelectBook(book.bookId)} /></td>
                  <td>
                    <div className="book-cell">
                      <img src={book.imageCover} alt={book.title} className="book-thumb-small" />
                      <div className="book-info">
                        <span className="book-name">{book.title}</span>
                        <span className="book-categories">{book.categories?.join(", ")}</span>
                      </div>
                    </div>
                  </td>
                  <td><code className="isbn-code">{book.isbn}</code></td>
                  <td>{book.author}</td>
                  <td>{book.yearPublished}</td>
                  <td>
                    <span className={`copies-badge ${book.copiesAvailable === 0 ? "out" : ""}`}>
                      {book.copiesAvailable}/{book.copiesTotal}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${book.active ? "active" : "inactive"}`}>
                      {book.active ? "Hoạt động" : "Đã ẩn"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" onClick={() => setViewingBook(book)}><Eye size={16} /></button>
                      <button className="action-btn edit" onClick={() => { setEditingBook(book); setShowModal(true); }}><Edit size={16} /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(book.bookId)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && books.length > 0 && (
        <div className="table-pagination">
          <div className="pagination-info">Hiển thị {books.length} / {totalElements} sách</div>
          <div className="pagination-controls">
            <select className="page-size-select" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
            </select>
            <div className="pagination-buttons">
              <button className="pagination-btn" disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={18} /></button>
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn" disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingBook && <BookViewModal book={viewingBook} onClose={() => setViewingBook(null)} />}
      
      {/* Form Modal */}
      {showModal && (
        <BookFormModal 
          book={editingBook} 
          categories={categories}
          onClose={() => { setShowModal(false); setEditingBook(null); }}
          onSuccess={fetchBooks}
        />
      )}
    </div>
  );
}


function BookViewModal({ book, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chi tiết sách</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div className="book-detail-layout">
            <div className="book-detail-cover">
              <img src={book.imageCover} alt={book.title} />
            </div>
            <div className="book-detail-info">
              <h3>{book.title}</h3>
              <p className="book-author-large">{book.author}</p>
              <div className="book-meta-grid">
                <div><label>ISBN</label><span>{book.isbn}</span></div>
                <div><label>NXB</label><span>{book.publisher}</span></div>
                <div><label>Năm XB</label><span>{book.yearPublished}</span></div>
                <div><label>Số trang</label><span>{book.pages}</span></div>
                <div><label>Ngôn ngữ</label><span>{book.language}</span></div>
                <div><label>Số lượng</label><span>{book.copiesAvailable}/{book.copiesTotal}</span></div>
              </div>
              <div className="book-categories-list">
                {book.categories?.map((cat, i) => <span key={i} className="category-tag">{cat}</span>)}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
}

function BookFormModal({ book, onClose, onSuccess, categories = [] }) {
  const [formData, setFormData] = useState({
    title: book?.title || "",
    author: book?.author || "",
    isbn: book?.isbn || "",
    publisher: book?.publisher || "",
    yearPublished: book?.yearPublished || "",
    pages: book?.pages || "",
    language: book?.language || "Tiếng Việt",
    copiesTotal: book?.copiesTotal || 1,
    description: book?.description || "",
    imageCover: book?.imageCover || "",
    categoryIds: book?.categoryIds || [],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleCategoryChange = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
    if (errors.categoryIds) setErrors(prev => ({ ...prev, categoryIds: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    // ISBN: bắt buộc, phải 10 hoặc 13 số
    if (!formData.isbn.trim()) {
      newErrors.isbn = "ISBN không được để trống";
    } else if (!/^(\d{10}|\d{13})$/.test(formData.isbn.trim())) {
      newErrors.isbn = "ISBN phải gồm 10 hoặc 13 chữ số";
    }

    // Title: bắt buộc
    if (!formData.title.trim()) {
      newErrors.title = "Tên sách không được để trống";
    }

    // Author: bắt buộc
    if (!formData.author.trim()) {
      newErrors.author = "Tác giả không được để trống";
    }

    // Year: không được lớn hơn năm hiện tại
    if (formData.yearPublished) {
      const year = Number(formData.yearPublished);
      if (year < 0) {
        newErrors.yearPublished = "Năm xuất bản không hợp lệ";
      } else if (year > currentYear) {
        newErrors.yearPublished = "Năm xuất bản không được lớn hơn năm hiện tại";
      }
    }

    // Pages: phải >= 1
    if (formData.pages && Number(formData.pages) < 1) {
      newErrors.pages = "Số trang phải lớn hơn 0";
    }

    // CopiesTotal: bắt buộc, >= 1
    if (!formData.copiesTotal || Number(formData.copiesTotal) < 1) {
      newErrors.copiesTotal = "Số lượng phải lớn hơn 0";
    }

    // Categories: bắt buộc ít nhất 1
    if (formData.categoryIds.length === 0) {
      newErrors.categoryIds = "Vui lòng chọn ít nhất một danh mục";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire("Lỗi!", "Vui lòng kiểm tra lại thông tin", "warning");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        isbn: formData.isbn.trim(),
        title: formData.title.trim(),
        author: formData.author.trim(),
        publisher: formData.publisher.trim() || null,
        yearPublished: formData.yearPublished ? Number(formData.yearPublished) : null,
        pages: formData.pages ? Number(formData.pages) : null,
        language: formData.language || null,
        description: formData.description.trim() || null,
        imageCover: formData.imageCover.trim() || null,
        copiesTotal: Number(formData.copiesTotal),
        categoryIds: formData.categoryIds,
      };

      if (book) {
        await updateBook(book.bookId, payload);
        Swal.fire("Thành công!", "Đã cập nhật sách", "success");
      } else {
        await createBook(payload);
        Swal.fire("Thành công!", "Đã thêm sách mới", "success");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error saving book:", error);
      Swal.fire("Lỗi!", error.response?.data?.message || "Không thể lưu sách", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{book ? "Chỉnh sửa sách" : "Thêm sách mới"}</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Tên sách <span className="required">*</span></label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => { setFormData({...formData, title: e.target.value}); if (errors.title) setErrors(prev => ({...prev, title: ""})); }}
                placeholder="Nhập tên sách" 
                className={errors.title ? "input-error" : ""}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Tác giả <span className="required">*</span></label>
                <input 
                  type="text" 
                  value={formData.author} 
                  onChange={e => { setFormData({...formData, author: e.target.value}); if (errors.author) setErrors(prev => ({...prev, author: ""})); }}
                  placeholder="Nhập tên tác giả" 
                  className={errors.author ? "input-error" : ""}
                />
                {errors.author && <span className="error-text">{errors.author}</span>}
              </div>
              <div className="form-group">
                <label>ISBN <span className="required">*</span></label>
                <input 
                  type="text" 
                  value={formData.isbn} 
                  onChange={e => { setFormData({...formData, isbn: e.target.value}); if (errors.isbn) setErrors(prev => ({...prev, isbn: ""})); }}
                  placeholder="10 hoặc 13 chữ số" 
                  className={errors.isbn ? "input-error" : ""}
                />
                {errors.isbn && <span className="error-text">{errors.isbn}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nhà xuất bản</label>
                <input type="text" value={formData.publisher} onChange={e => setFormData({...formData, publisher: e.target.value})} placeholder="Nhập nhà xuất bản" />
              </div>
              <div className="form-group">
                <label>Năm xuất bản</label>
                <input 
                  type="number" 
                  value={formData.yearPublished} 
                  onChange={e => { setFormData({...formData, yearPublished: e.target.value}); if (errors.yearPublished) setErrors(prev => ({...prev, yearPublished: ""})); }}
                  placeholder="VD: 2024" 
                  min="0"
                  max={new Date().getFullYear()}
                  className={errors.yearPublished ? "input-error" : ""}
                />
                {errors.yearPublished && <span className="error-text">{errors.yearPublished}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Số trang</label>
                <input 
                  type="number" 
                  value={formData.pages} 
                  onChange={e => { setFormData({...formData, pages: e.target.value}); if (errors.pages) setErrors(prev => ({...prev, pages: ""})); }}
                  placeholder="VD: 320" 
                  min="1"
                  className={errors.pages ? "input-error" : ""}
                />
                {errors.pages && <span className="error-text">{errors.pages}</span>}
              </div>
              <div className="form-group">
                <label>Ngôn ngữ</label>
                <select value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})}>
                  <option value="Tiếng Việt">Tiếng Việt</option>
                  <option value="Tiếng Anh">Tiếng Anh</option>
                  <option value="Tiếng Trung">Tiếng Trung</option>
                  <option value="Tiếng Nhật">Tiếng Nhật</option>
                  <option value="Tiếng Hàn">Tiếng Hàn</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Số lượng <span className="required">*</span></label>
                <input 
                  type="number" 
                  value={formData.copiesTotal} 
                  onChange={e => { setFormData({...formData, copiesTotal: e.target.value}); if (errors.copiesTotal) setErrors(prev => ({...prev, copiesTotal: ""})); }}
                  min="1" 
                  className={errors.copiesTotal ? "input-error" : ""}
                />
                {errors.copiesTotal && <span className="error-text">{errors.copiesTotal}</span>}
              </div>
              <div className="form-group">
                <label>Ảnh bìa (URL)</label>
                <input type="url" value={formData.imageCover} onChange={e => setFormData({...formData, imageCover: e.target.value})} placeholder="https://example.com/image.jpg" />
              </div>
            </div>
            <div className="form-group">
              <label>Danh mục <span className="required">*</span></label>
              <div className={`category-checkbox-list ${errors.categoryIds ? "input-error" : ""}`}>
                {categories.length > 0 ? categories.map(cat => (
                  <label key={cat.categoryId} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.categoryIds.includes(cat.categoryId)}
                      onChange={() => handleCategoryChange(cat.categoryId)}
                    />
                    <span>{cat.categoryName}</span>
                  </label>
                )) : (
                  <p className="text-muted">Chưa có danh mục nào</p>
                )}
              </div>
              {errors.categoryIds && <span className="error-text">{errors.categoryIds}</span>}
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Nhập mô tả sách"></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Hủy</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Đang xử lý..." : (book ? "Cập nhật" : "Thêm mới")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  BookOpen, Plus, Search, Download, Upload,
  Edit, Trash2, Eye, ChevronLeft, ChevronRight,
  RefreshCw, AlertCircle, X, Calendar, FileText, Image
} from "lucide-react";
import Swal from "sweetalert2";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
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

  // Mock data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setBooks([
        { bookId: 1, isbn: "978-0-13-468599-1", title: "Đắc Nhân Tâm", author: "Dale Carnegie", publisher: "NXB Tổng hợp", yearPublished: 2020, pages: 320, language: "Tiếng Việt", copiesTotal: 10, copiesAvailable: 7, imageCover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200", active: true, categories: ["Kỹ năng sống", "Tâm lý"] },
        { bookId: 2, isbn: "978-0-06-112008-4", title: "Nhà Giả Kim", author: "Paulo Coelho", publisher: "NXB Văn học", yearPublished: 2019, pages: 228, language: "Tiếng Việt", copiesTotal: 8, copiesAvailable: 3, imageCover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200", active: true, categories: ["Văn học", "Triết học"] },
        { bookId: 3, isbn: "978-0-06-231609-7", title: "Sapiens: Lược Sử Loài Người", author: "Yuval Noah Harari", publisher: "NXB Tri thức", yearPublished: 2021, pages: 560, language: "Tiếng Việt", copiesTotal: 5, copiesAvailable: 0, imageCover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200", active: true, categories: ["Lịch sử", "Khoa học"] },
        { bookId: 4, isbn: "978-0-7352-1129-2", title: "Atomic Habits", author: "James Clear", publisher: "NXB Lao động", yearPublished: 2022, pages: 320, language: "Tiếng Việt", copiesTotal: 12, copiesAvailable: 9, imageCover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=200", active: true, categories: ["Kỹ năng sống"] },
        { bookId: 5, isbn: "978-1-59448-190-9", title: "Think and Grow Rich", author: "Napoleon Hill", publisher: "NXB Kinh tế", yearPublished: 2018, pages: 280, language: "Tiếng Việt", copiesTotal: 6, copiesAvailable: 4, imageCover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200", active: false, categories: ["Kinh doanh"] },
      ]);
      setTotalElements(5);
      setTotalPages(1);
      setLoading(false);
    }, 500);
  }, [currentPage, pageSize]);

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
      Swal.fire("Thành công!", "Đã xóa sách.", "success");
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
          <button className="btn-secondary" onClick={() => setLoading(true)}>
            <RefreshCw size={18} /> Làm mới
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
      {showModal && <BookFormModal book={editingBook} onClose={() => { setShowModal(false); setEditingBook(null); }} />}
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

function BookFormModal({ book, onClose }) {
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
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire("Thành công!", book ? "Đã cập nhật sách" : "Đã thêm sách mới", "success");
    onClose();
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
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Tác giả <span className="required">*</span></label>
                <input type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>ISBN</label>
                <input type="text" value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nhà xuất bản</label>
                <input type="text" value={formData.publisher} onChange={e => setFormData({...formData, publisher: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Năm xuất bản</label>
                <input type="number" value={formData.yearPublished} onChange={e => setFormData({...formData, yearPublished: e.target.value})} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Số trang</label>
                <input type="number" value={formData.pages} onChange={e => setFormData({...formData, pages: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Số lượng</label>
                <input type="number" value={formData.copiesTotal} onChange={e => setFormData({...formData, copiesTotal: e.target.value})} min="1" />
              </div>
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-primary">{book ? "Cập nhật" : "Thêm mới"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

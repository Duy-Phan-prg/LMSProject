import { useState } from "react";
import {
  HelpCircle, Search, Book, Users, ShoppingCart, Settings,
  ChevronDown, ChevronUp, MessageCircle, Mail, Phone, ExternalLink
} from "lucide-react";

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      category: "Người dùng",
      question: "Làm thế nào để thêm người dùng mới?",
      answer: "Vào mục Người dùng > Nhấn nút 'Thêm người dùng' > Điền thông tin và nhấn Lưu."
    },
    {
      id: 2,
      category: "Người dùng",
      question: "Làm thế nào để khóa tài khoản người dùng?",
      answer: "Vào mục Người dùng > Tìm người dùng cần khóa > Nhấn nút Sửa > Chuyển trạng thái sang 'Đã khóa'."
    },
    {
      id: 3,
      category: "Sách",
      question: "Làm thế nào để thêm sách mới?",
      answer: "Vào mục Sách > Nhấn nút 'Thêm sách' > Điền thông tin sách và nhấn Lưu."
    },
    {
      id: 4,
      category: "Sách",
      question: "Làm thế nào để quản lý số lượng sách?",
      answer: "Vào mục Sách > Chọn sách cần cập nhật > Nhấn Sửa > Thay đổi số lượng tổng và số lượng có sẵn."
    },
    {
      id: 5,
      category: "Mượn/Trả",
      question: "Làm thế nào để xác nhận trả sách?",
      answer: "Vào mục Mượn/Trả > Tìm giao dịch cần xác nhận > Nhấn nút xác nhận trả sách."
    },
    {
      id: 6,
      category: "Mượn/Trả",
      question: "Làm thế nào để xử lý sách quá hạn?",
      answer: "Vào mục Mượn/Trả > Lọc theo trạng thái 'Quá hạn' > Liên hệ người mượn hoặc tính phí phạt."
    },
    {
      id: 7,
      category: "Báo cáo",
      question: "Làm thế nào để xuất báo cáo?",
      answer: "Vào mục Báo cáo > Chọn khoảng thời gian > Nhấn nút 'Xuất báo cáo' để tải file Excel."
    },
  ];

  const guides = [
    { icon: <Users size={24} />, title: "Quản lý người dùng", desc: "Hướng dẫn thêm, sửa, xóa người dùng", link: "#" },
    { icon: <Book size={24} />, title: "Quản lý sách", desc: "Hướng dẫn quản lý kho sách", link: "#" },
    { icon: <ShoppingCart size={24} />, title: "Quản lý mượn/trả", desc: "Hướng dẫn xử lý mượn trả sách", link: "#" },
    { icon: <Settings size={24} />, title: "Cài đặt hệ thống", desc: "Hướng dẫn cấu hình hệ thống", link: "#" },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page help-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><HelpCircle size={28} /></div>
          <div>
            <h1 className="page-title">Trợ giúp</h1>
            <p className="page-subtitle">Hướng dẫn sử dụng và hỗ trợ</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="help-search">
        <Search size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm câu hỏi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Quick Guides */}
      <div className="help-section">
        <h3>Hướng dẫn nhanh</h3>
        <div className="guides-grid">
          {guides.map((guide, index) => (
            <a key={index} href={guide.link} className="guide-card">
              <div className="guide-icon">{guide.icon}</div>
              <div className="guide-info">
                <h4>{guide.title}</h4>
                <p>{guide.desc}</p>
              </div>
              <ExternalLink size={16} />
            </a>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="help-section">
        <h3>Câu hỏi thường gặp</h3>
        <div className="faq-list">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className={`faq-item ${openFaq === faq.id ? "open" : ""}`}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}>
                <span className="faq-category">{faq.category}</span>
                <span className="faq-text">{faq.question}</span>
                {openFaq === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {openFaq === faq.id && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="help-section">
        <h3>Liên hệ hỗ trợ</h3>
        <div className="contact-cards">
          <div className="contact-card">
            <Mail size={24} />
            <h4>Email</h4>
            <p>support@libraryhub.vn</p>
          </div>
          <div className="contact-card">
            <Phone size={24} />
            <h4>Hotline</h4>
            <p>1900 1234</p>
          </div>
          <div className="contact-card">
            <MessageCircle size={24} />
            <h4>Live Chat</h4>
            <p>Hỗ trợ 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
}

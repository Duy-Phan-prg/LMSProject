import { useState } from "react";
import { Settings, Save, RefreshCw, AlertCircle, BookOpen, Clock, DollarSign } from "lucide-react";
import Swal from "sweetalert2";

export default function SystemConfigPage() {
  const [config, setConfig] = useState({
    maxBorrowDays: 14,
    maxBooksPerUser: 5,
    overdueFinePerDay: 5000,
    maxRenewTimes: 2,
    renewDays: 7,
    allowReservation: true,
    reservationDays: 3,
    sendEmailReminder: true,
    reminderDaysBefore: 2
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Gọi API lưu config
      await new Promise(resolve => setTimeout(resolve, 1000));
      Swal.fire("Thành công!", "Đã lưu cấu hình hệ thống", "success");
    } catch (error) {
      Swal.fire("Lỗi!", "Không thể lưu cấu hình", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon"><Settings size={28} /></div>
          <div>
            <h1 className="page-title">Cấu hình hệ thống</h1>
            <p className="page-subtitle">Thiết lập chính sách mượn sách và phạt</p>
          </div>
        </div>
        <div className="page-header-right">
          <button className="btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? <RefreshCw size={18} className="spin" /> : <Save size={18} />}
            {loading ? "Đang lưu..." : "Lưu cấu hình"}
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Borrow Settings */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3><BookOpen size={20} /> Chính sách mượn sách</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label>Số ngày mượn tối đa</label>
              <input
                type="number"
                value={config.maxBorrowDays}
                onChange={e => setConfig({...config, maxBorrowDays: Number(e.target.value)})}
                min="1"
                max="60"
              />
              <small style={{color: '#94a3b8', marginTop: 4, display: 'block'}}>Số ngày tối đa cho mỗi lần mượn</small>
            </div>
            <div className="form-group">
              <label>Số sách tối đa / user</label>
              <input
                type="number"
                value={config.maxBooksPerUser}
                onChange={e => setConfig({...config, maxBooksPerUser: Number(e.target.value)})}
                min="1"
                max="20"
              />
              <small style={{color: '#94a3b8', marginTop: 4, display: 'block'}}>Số sách tối đa một user có thể mượn cùng lúc</small>
            </div>
            <div className="form-group">
              <label>Số lần gia hạn tối đa</label>
              <input
                type="number"
                value={config.maxRenewTimes}
                onChange={e => setConfig({...config, maxRenewTimes: Number(e.target.value)})}
                min="0"
                max="5"
              />
            </div>
            <div className="form-group">
              <label>Số ngày mỗi lần gia hạn</label>
              <input
                type="number"
                value={config.renewDays}
                onChange={e => setConfig({...config, renewDays: Number(e.target.value)})}
                min="1"
                max="30"
              />
            </div>
          </div>
        </div>

        {/* Fine Settings */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3><DollarSign size={20} /> Chính sách phạt</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label>Phí phạt quá hạn (VNĐ/ngày)</label>
              <input
                type="number"
                value={config.overdueFinePerDay}
                onChange={e => setConfig({...config, overdueFinePerDay: Number(e.target.value)})}
                min="0"
                step="1000"
              />
              <small style={{color: '#94a3b8', marginTop: 4, display: 'block'}}>Số tiền phạt cho mỗi ngày quá hạn</small>
            </div>
            <div style={{padding: 16, background: 'rgba(239,68,68,0.1)', borderRadius: 8, marginTop: 16}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8}}>
                <AlertCircle size={18} style={{color: '#f87171'}} />
                <span style={{fontWeight: 600, color: '#f87171'}}>Lưu ý</span>
              </div>
              <p style={{color: '#94a3b8', fontSize: '0.9rem', margin: 0}}>
                Phí phạt sẽ được tính tự động khi user trả sách quá hạn. 
                User phải thanh toán phí phạt trước khi mượn sách mới.
              </p>
            </div>
          </div>
        </div>

        {/* Reservation Settings */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3><Clock size={20} /> Đặt trước sách</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={config.allowReservation}
                  onChange={e => setConfig({...config, allowReservation: e.target.checked})}
                />
                <span>Cho phép đặt trước sách</span>
              </label>
            </div>
            {config.allowReservation && (
              <div className="form-group">
                <label>Số ngày giữ sách đặt trước</label>
                <input
                  type="number"
                  value={config.reservationDays}
                  onChange={e => setConfig({...config, reservationDays: Number(e.target.value)})}
                  min="1"
                  max="7"
                />
                <small style={{color: '#94a3b8', marginTop: 4, display: 'block'}}>Số ngày giữ sách cho user sau khi sách có sẵn</small>
              </div>
            )}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3><AlertCircle size={20} /> Thông báo</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={config.sendEmailReminder}
                  onChange={e => setConfig({...config, sendEmailReminder: e.target.checked})}
                />
                <span>Gửi email nhắc nhở trước hạn trả</span>
              </label>
            </div>
            {config.sendEmailReminder && (
              <div className="form-group">
                <label>Số ngày trước hạn trả</label>
                <input
                  type="number"
                  value={config.reminderDaysBefore}
                  onChange={e => setConfig({...config, reminderDaysBefore: Number(e.target.value)})}
                  min="1"
                  max="7"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

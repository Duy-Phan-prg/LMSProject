import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { handleVNPayReturn } from "../services/paymentService";
import "../styles/payment.css";

export default function VNPayReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, failed
  const [message, setMessage] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Lấy tất cả query params từ VNPay
        const params = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        console.log("VNPay return params:", params);

        // Gọi API backend để xử lý kết quả thanh toán
        const response = await handleVNPayReturn(params);
        const data = response.result || response;

        console.log("Payment result:", data);

        if (data.success || data.status === "SUCCESS") {
          setStatus("success");
          setMessage(data.message || "Thanh toán thành công!");
          setPaymentInfo(data);
        } else {
          setStatus("failed");
          setMessage(data.message || "Thanh toán thất bại!");
          setPaymentInfo(data);
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        setStatus("failed");
        setMessage(error.response?.data?.message || "Có lỗi xảy ra khi xử lý thanh toán");
      }
    };

    processPayment();
  }, [searchParams]);

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleViewBorrows = () => {
    navigate("/my-borrows");
  };

  return (
    <div className="payment-result-page">
      <div className="payment-result-container">
        {status === "loading" && (
          <div className="payment-loading">
            <Loader size={64} className="spin" />
            <h2>Đang xử lý thanh toán...</h2>
            <p>Vui lòng đợi trong giây lát</p>
          </div>
        )}

        {status === "success" && (
          <div className="payment-success">
            <div className="payment-icon success">
              <CheckCircle size={80} />
            </div>
            <h1>Thanh toán thành công!</h1>
            <p className="payment-message">{message}</p>
            
            {paymentInfo && (
              <div className="payment-details">
                <div className="payment-detail-row">
                  <span>Mã giao dịch:</span>
                  <strong>{paymentInfo.transactionId || paymentInfo.vnp_TransactionNo}</strong>
                </div>
                <div className="payment-detail-row">
                  <span>Số tiền:</span>
                  <strong>{(paymentInfo.amount || 0).toLocaleString("vi-VN")}đ</strong>
                </div>
                <div className="payment-detail-row">
                  <span>Thời gian:</span>
                  <strong>{new Date().toLocaleString("vi-VN")}</strong>
                </div>
              </div>
            )}

            <div className="payment-actions">
              <button className="btn-primary" onClick={handleViewBorrows}>
                Xem lịch sử mượn
              </button>
              <button className="btn-secondary" onClick={handleBackToHome}>
                Về trang chủ
              </button>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="payment-failed">
            <div className="payment-icon failed">
              <XCircle size={80} />
            </div>
            <h1>Thanh toán thất bại</h1>
            <p className="payment-message">{message}</p>
            
            {paymentInfo && (
              <div className="payment-details">
                <div className="payment-detail-row">
                  <span>Mã lỗi:</span>
                  <strong>{paymentInfo.errorCode || "N/A"}</strong>
                </div>
              </div>
            )}

            <div className="payment-actions">
              <button className="btn-primary" onClick={handleViewBorrows}>
                Thử lại
              </button>
              <button className="btn-secondary" onClick={handleBackToHome}>
                Về trang chủ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

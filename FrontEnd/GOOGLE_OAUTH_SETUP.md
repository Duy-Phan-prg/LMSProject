# Google OAuth2 Integration Guide

## Tích hợp Google Login vào Frontend

### 📋 Các file đã tạo:

1. **`src/services/authService.js`** - Service xử lý authentication
   - Quản lý tokens (lưu, lấy, xóa)
   - Gọi API login/register
   - Xử lý OAuth2 callback

2. **`src/utils/axiosConfig.js`** - Axios interceptor
   - Tự động thêm token vào header
   - Xử lý token hết hạn (refresh token)

3. **`src/context/AuthContext.jsx`** - React Context
   - Quản lý trạng thái authentication
   - Cung cấp hook `useAuth()`

4. **`src/pages/OAuth2Callback.jsx`** - Callback page
   - Xử lý redirect từ Google
   - Lưu tokens vào localStorage

5. **`src/components/LoginForm.jsx`** - Login component
   - Form login truyền thống
   - Nút "Đăng nhập với Google"

6. **`src/components/ProtectedRoute.jsx`** - Route protection
   - Bảo vệ các route cần authentication

### 🔧 Cấu hình Backend:

Backend đã được cấu hình sẵn trong `application.properties`:

```properties
spring.security.oauth2.client.registration.google.client-id=204638644064-2cjnrt0nol4b2bqqumph2cf7l2pmij5b.apps.googleusercontent.com
spring.security.oauth2.client.registration.google.client-secret=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
spring.security.oauth2.client.registration.google.scope=email,profile
```

### 🚀 Cách sử dụng:

#### 1. Wrap App với AuthProvider

Đã cập nhật `src/main.jsx`:

```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

#### 2. Sử dụng hook `useAuth()` trong component:

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, googleLogin, logout } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <>
          <button onClick={() => login(email, password)}>Login</button>
          <button onClick={googleLogin}>Login with Google</button>
        </>
      )}
    </>
  );
}
```

#### 3. Bảo vệ route:

```jsx
import ProtectedRoute from '../components/ProtectedRoute';

<Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
  <Route path="/admin" element={<AdminDashboardPage />} />
</Route>
```

### 📱 Flow Google Login:

1. User click "Đăng nhập với Google"
2. Frontend gọi `authService.googleLogin()`
3. Redirect sang `/api/user/google-login` (Backend)
4. Backend redirect sang Google OAuth2 endpoint
5. User authenticate với Google
6. Google redirect về `/oauth2/callback?accessToken=...&refreshToken=...`
7. Frontend xử lý callback, lưu tokens
8. Redirect về home page

### 🔐 Token Management:

- **Access Token**: Lưu trong localStorage, gửi trong header `Authorization: Bearer <token>`
- **Refresh Token**: Lưu trong localStorage, dùng để lấy access token mới khi hết hạn
- **Auto Refresh**: Axios interceptor tự động refresh token khi nhận 401

### ⚙️ Cấu hình CORS:

Backend đã cấu hình CORS cho `http://localhost:5173` (Vite dev server)

### 🧪 Test:

1. Chạy Backend: `mvn spring-boot:run`
2. Chạy Frontend: `npm run dev`
3. Truy cập `http://localhost:5173/login`
4. Click "Đăng nhập với Google"
5. Authenticate với Google account
6. Redirect về home page

### 📝 Lưu ý:

- Tokens được lưu trong localStorage (không an toàn cho production)
- Để production-ready, nên lưu tokens trong httpOnly cookies
- Cần cấu hình HTTPS cho production
- Google OAuth2 credentials cần được bảo mật (không commit vào git)

### 🐛 Troubleshooting:

**Lỗi CORS:**
- Kiểm tra Backend CORS config
- Đảm bảo Frontend URL được whitelist

**Token không được lưu:**
- Kiểm tra localStorage trong DevTools
- Kiểm tra URL callback có đúng không

**Redirect loop:**
- Kiểm tra ProtectedRoute logic
- Đảm bảo AuthProvider wrap toàn bộ App

**Token hết hạn:**
- Axios interceptor sẽ tự động refresh
- Nếu refresh fail, user sẽ redirect về login

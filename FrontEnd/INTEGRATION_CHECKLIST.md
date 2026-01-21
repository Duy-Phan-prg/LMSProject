# Google OAuth2 Integration Checklist

## ✅ Frontend Files Created

- [x] `src/services/authService.js` - Authentication service
- [x] `src/utils/axiosConfig.js` - Axios interceptor for JWT
- [x] `src/context/AuthContext.jsx` - Auth context provider
- [x] `src/pages/OAuth2Callback.jsx` - OAuth2 callback handler
- [x] `src/components/LoginForm.jsx` - Login form component
- [x] `src/components/ProtectedRoute.jsx` - Route protection
- [x] `src/main.jsx` - Updated with AuthProvider
- [x] `src/routes/AppRoutes.jsx` - Added OAuth2 callback route
- [x] `src/pages/LoginPage.jsx` - Updated to use googleLogin

## 🔧 Backend Configuration (Already Done)

- [x] Google OAuth2 credentials in `application.properties`
- [x] SecurityConfig with OAuth2 login
- [x] OAuth2SuccessHandler for token generation
- [x] JwtTokenProvider for JWT management
- [x] JwtAuthenticationFilter for request validation
- [x] UserController with `/api/user/google-login` endpoint

## 📋 Integration Points

### 1. Login Flow
```
Frontend: Click "Đăng nhập với Google"
  ↓
Frontend: authService.googleLogin()
  ↓
Backend: GET /api/user/google-login
  ↓
Backend: Redirect to Google OAuth2
  ↓
Google: User authenticates
  ↓
Backend: OAuth2SuccessHandler processes callback
  ↓
Backend: Generate JWT tokens
  ↓
Backend: Redirect to http://localhost:5173/oauth2/callback?accessToken=...&refreshToken=...
  ↓
Frontend: OAuth2Callback component handles redirect
  ↓
Frontend: Save tokens to localStorage
  ↓
Frontend: Redirect to home page
```

### 2. API Request Flow
```
Frontend: Make API request
  ↓
Axios Interceptor: Add Authorization header with token
  ↓
Backend: JwtAuthenticationFilter validates token
  ↓
Backend: Process request
  ↓
Response: Return data
```

### 3. Token Refresh Flow
```
Frontend: Receive 401 response
  ↓
Axios Interceptor: Catch 401
  ↓
Frontend: Call authService.refreshToken()
  ↓
Backend: Validate refresh token
  ↓
Backend: Generate new access token
  ↓
Frontend: Retry original request with new token
```

## 🚀 Next Steps

1. **Test Backend**
   ```bash
   cd BackEnd
   mvn spring-boot:run
   ```

2. **Test Frontend**
   ```bash
   cd FrontEnd
   npm install
   npm run dev
   ```

3. **Test Google Login**
   - Go to http://localhost:5173/login
   - Click "Đăng nhập với Google"
   - Authenticate with Google account
   - Should redirect to home page with tokens saved

## 🔐 Security Notes

### Current Implementation (Development)
- Tokens stored in localStorage
- No httpOnly flag
- Suitable for development/testing

### Production Recommendations
1. Store tokens in httpOnly cookies
2. Use HTTPS only
3. Implement CSRF protection
4. Add rate limiting
5. Implement token rotation
6. Add security headers (CSP, X-Frame-Options, etc.)

## 📝 Environment Variables

### Backend (application.properties)
```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_OAUTH_CALLBACK_URL=http://localhost:5173/oauth2/callback
```

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution:** Check Backend CORS configuration in SecurityConfig

### Issue: Tokens not saved
**Solution:** Check browser localStorage in DevTools

### Issue: Redirect loop
**Solution:** Verify ProtectedRoute and AuthProvider setup

### Issue: Token validation fails
**Solution:** Check JWT secret key matches between Backend and Frontend

### Issue: Google redirect fails
**Solution:** Verify Google OAuth2 credentials in application.properties

## 📚 Files Reference

| File | Purpose |
|------|---------|
| authService.js | Handle auth operations |
| axiosConfig.js | Intercept HTTP requests |
| AuthContext.jsx | Manage auth state |
| OAuth2Callback.jsx | Handle OAuth2 redirect |
| ProtectedRoute.jsx | Protect routes |
| LoginPage.jsx | Login UI |

## ✨ Features Implemented

- [x] Traditional email/password login
- [x] Google OAuth2 login
- [x] JWT token management
- [x] Automatic token refresh
- [x] Protected routes
- [x] User context
- [x] Logout functionality
- [x] Error handling
- [x] Loading states

## 🎯 Testing Scenarios

1. **Login with Email/Password**
   - Enter valid credentials
   - Should redirect to home
   - Tokens should be in localStorage

2. **Login with Google**
   - Click Google button
   - Authenticate with Google
   - Should redirect to home
   - Tokens should be in localStorage

3. **Access Protected Route**
   - Login first
   - Access protected route
   - Should work without redirect

4. **Token Expiration**
   - Wait for access token to expire
   - Make API request
   - Should automatically refresh token
   - Request should succeed

5. **Logout**
   - Click logout
   - Tokens should be cleared
   - Should redirect to login
   - Protected routes should redirect to login

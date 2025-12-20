import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import DashboardLayout from "../layouts/DashboardLayout";
import UserListPage from "../features/users/UserListPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<Navigate to="users" />} />
        <Route path="users" element={<UserListPage />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

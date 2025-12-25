import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AdminLayout from "../layouts/AdminLayout";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import BookDetailPage from "../pages/BookDetailPage";

// Admin Pages
import DashboardPage from "../pages/admin/DashboardPage";
import UserListPage from "../features/users/UserListPage";
import BooksPage from "../pages/admin/BooksPage";
import CategoriesPage from "../pages/admin/CategoriesPage";
import BorrowsPage from "../pages/admin/BorrowsPage";
import ReportsPage from "../pages/admin/ReportsPage";
import SettingsPage from "../pages/admin/SettingsPage";
import HelpPage from "../pages/admin/HelpPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth - No Layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Public - Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:id" element={<BookDetailPage />} />
      </Route>

      {/* Admin - Admin Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UserListPage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="borrows" element={<BorrowsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="help" element={<HelpPage />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

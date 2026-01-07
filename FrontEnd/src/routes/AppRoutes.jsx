import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AdminLayout from "../layouts/AdminLayout";
import LibrarianLayout from "../layouts/LibrarianLayout";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import BookDetailPage from "../pages/BookDetailPage";
import ProfilePage from "../pages/ProfilePage";
import MyBorrowsPage from "../pages/MyBorrowsPage";
import SettingsPage from "../pages/SettingsPage";

// Admin Pages
import AdminDashboardPage from "../pages/admin/DashboardPage";
import UserManagementPage from "../pages/admin/UserManagementPage";
import StatisticsPage from "../pages/admin/StatisticsPage";
import ActivityLogPage from "../pages/admin/ActivityLogPage";
import SystemConfigPage from "../pages/admin/SystemConfigPage";
import ReportsPage from "../pages/admin/ReportsPage";
import BorrowHistoryPage from "../pages/admin/BorrowHistoryPage";
import HelpPage from "../pages/admin/HelpPage";

// Librarian Pages
import LibrarianDashboard from "../pages/librarian/LibrarianDashboard";
import LibrarianBooksPage from "../pages/librarian/LibrarianBooksPage";
import LibrarianCategoriesPage from "../pages/librarian/LibrarianCategoriesPage";
import LibrarianBorrowsPage from "../pages/librarian/LibrarianBorrowsPage";
import LibrarianMembersPage from "../pages/librarian/LibrarianMembersPage";

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
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-borrows" element={<MyBorrowsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Admin - Admin Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="borrow-history" element={<BorrowHistoryPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="activity-log" element={<ActivityLogPage />} />
        <Route path="config" element={<SystemConfigPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="help" element={<HelpPage />} />
      </Route>

      {/* Librarian - Librarian Layout */}
      <Route path="/librarian" element={<LibrarianLayout />}>
        <Route index element={<LibrarianDashboard />} />
        <Route path="books" element={<LibrarianBooksPage />} />
        <Route path="categories" element={<LibrarianCategoriesPage />} />
        <Route path="borrows" element={<LibrarianBorrowsPage />} />
        <Route path="members" element={<LibrarianMembersPage />} />
        <Route path="help" element={<HelpPage />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

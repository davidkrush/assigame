import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

import Navbar from './components/buyer/Navbar';
import Footer from './components/buyer/Footer';
import SellerLayout from './components/seller/SellerLayout';
import AdminLayout from './components/admin/AdminLayout';

import HomePage from './pages/buyer/HomePage';
import ProductsPage from './pages/buyer/ProductsPage';
import ProductDetailPage from './pages/buyer/ProductDetailPage';

import { SellerLoginPage, SellerRegisterPage } from './pages/seller/SellerAuthPages';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import ProductForm from './pages/seller/ProductForm';
import { SellerProfile, SellerSettings } from './pages/seller/SellerProfile';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { AdminUsers, AdminSellers, AdminProducts, AdminCategories, AdminReports, AdminSettings } from './pages/admin/AdminPages';
import { TermsPage, PrivacyPage } from './pages/buyer/LegalPages';

function BuyerWrapper({ children }) {
  return <><Navbar />{children}<Footer /></>;
}

function AdminGuard({ children }) {
  const isAdminAuth = !!localStorage.getItem('admin_token');
  if (!isAdminAuth) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<BuyerWrapper><HomePage /></BuyerWrapper>} />
              <Route path="/products" element={<BuyerWrapper><ProductsPage /></BuyerWrapper>} />
              <Route path="/products/:id" element={<BuyerWrapper><ProductDetailPage /></BuyerWrapper>} />

              <Route path="/seller/login" element={<SellerLoginPage />} />
              <Route path="/seller/register" element={<SellerRegisterPage />} />
              <Route path="/seller/dashboard" element={<SellerLayout><SellerDashboard /></SellerLayout>} />
              <Route path="/seller/products" element={<SellerLayout><SellerProducts /></SellerLayout>} />
              <Route path="/seller/products/new" element={<SellerLayout><ProductForm /></SellerLayout>} />
              <Route path="/seller/products/:id/edit" element={<SellerLayout><ProductForm /></SellerLayout>} />
              <Route path="/seller/profile" element={<SellerLayout><SellerProfile /></SellerLayout>} />
              <Route path="/seller/settings" element={<SellerLayout><SellerSettings /></SellerLayout>} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminGuard><AdminLayout><AdminDashboard /></AdminLayout></AdminGuard>} />
              <Route path="/admin/users" element={<AdminGuard><AdminLayout><AdminUsers /></AdminLayout></AdminGuard>} />
              <Route path="/admin/sellers" element={<AdminGuard><AdminLayout><AdminSellers /></AdminLayout></AdminGuard>} />
              <Route path="/admin/products" element={<AdminGuard><AdminLayout><AdminProducts /></AdminLayout></AdminGuard>} />
              <Route path="/admin/categories" element={<AdminGuard><AdminLayout><AdminCategories /></AdminLayout></AdminGuard>} />
              <Route path="/admin/reports" element={<AdminGuard><AdminLayout><AdminReports /></AdminLayout></AdminGuard>} />
              <Route path="/admin/settings" element={<AdminGuard><AdminLayout><AdminSettings /></AdminLayout></AdminGuard>} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

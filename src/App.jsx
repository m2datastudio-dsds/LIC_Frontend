import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import './index.css';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MyEnquiriesPage from './pages/MyEnquiriesPage';
import AskAgentPage from './pages/AskAgentPage';
import ProfilePage from './pages/ProfilePage';
import LifeInsurancePage from './pages/LifeInsurancePage';
import LifePlanListPage from './pages/LifePlanListPage';
import HealthInsurancePage from './pages/HealthInsurancePage';
import HealthPlanListPage from './pages/HealthPlanListPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRealEstatePage from './pages/AdminRealEstateWithInbox';
import AdminEnquiriesPage from './pages/AdminEnquiriesPage';
import RealEstatePage from './pages/RealEstatePage';
import RealEstateDetailPage from './pages/RealEstateDetailPage';
import LicOfficialProductsPage from './pages/LicOfficialProductsPage';
import OfficialProductDetailPage from './pages/OfficialProductDetailPage';
import './lic-products.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/life-insurance" element={<LifeInsurancePage />} />
          <Route path="/life-insurance/:categoryId" element={<LifePlanListPage />} />
          <Route path="/health-insurance" element={<HealthInsurancePage />} />
          <Route path="/health-insurance/:categoryId" element={<HealthPlanListPage />} />
          <Route path="/real-estate" element={<RealEstatePage />} />
          <Route path="/real-estate/:id" element={<RealEstateDetailPage />} />
          <Route path="/lic-official-products" element={<LicOfficialProductsPage />} />
          <Route path="/official-product/:provider" element={<OfficialProductDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-enquiries" element={<MyEnquiriesPage />} />
          <Route path="/ask-agent" element={<AskAgentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin/dashboard" element={<Navigate to="/admin/real-estate" replace />} />
          <Route path="/admin/real-estate" element={<AdminRealEstatePage />} />
          <Route path="/admin/real-estate/new" element={<AdminRealEstatePage />} />
          <Route path="/admin/real-estate/:propertyId/edit" element={<AdminRealEstatePage />} />
          <Route path="/admin/enquiries" element={<AdminEnquiriesPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

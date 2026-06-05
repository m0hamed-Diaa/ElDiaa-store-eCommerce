import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import HomePage from "@/pages/UsersPages";
import PageNotFound from "@/pages/PageNotFound";
import ErrorHandler from "@/components/errors/ErrorHandler";
import UserLayout from "@/pages/UsersPages/Layout";
import ProductsPage from "@/pages/UsersPages/ProductsPage";
import AboutPage from "@/pages/UsersPages/AboutPage";
import ContactPage from "@/pages/UsersPages/ContactPage";
import SettingsPage from "@/pages/UsersPages/SettingsPage";
import ProductDetails from "@/pages/UsersPages/ProductDetails";
import AdminLayout from "@/pages/Admin/AdminLayout";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminProducts from "@/pages/Admin/AdminProducts";
import AdminCategories from "@/pages/Admin/CategoriesPage";
import AdminHeroSlides from "@/pages/Admin/AdminHeroSlides";
import OrdersPage from "@/pages/Admin/OrdersPage";
import UsersPage from "@/pages/Admin/UsersPage";
import ReviewsPage from "@/pages/Admin/ReviewsPage";
import CouponsPage from "@/pages/Admin/CouponsPage";
import AnalyticsPage from "@/pages/Admin/AnalyticsPage";
import AdminSettingsPage from "@/pages/Admin/SettingsPage";
import Checkout from "@/pages/UsersPages/Checkout";
import ProfilePage from "@/pages/UsersPages/ProfilePage";
import UserProtectedRoute from "@/components/auth/UserProtectedRoute";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import LoginPage from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";
import ResetPasswordPage from "@/pages/auth/ResetPassword";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* UserPages path */}
      <Route path="/" element={<UserLayout />} errorElement={<ErrorHandler path={"/"} />}>
        <Route
          index
          element={
            <HomePage />
          }
        />
        <Route
          path="products"
          element={
            <ProductsPage />
          }
        />
        <Route
          path="products/:documentId"
          element={
            <ProductDetails />
          }
        />
        <Route
          path="about"
          element={
            <AboutPage />
          }
        />
        <Route
          path="contact"
          element={
            <ContactPage />
          }
        />
        <Route
          path="settings"
          element={
            <SettingsPage />
          }
        />
        {/* Protected Routes */}
        <Route element={<UserProtectedRoute />}>
          <Route
            path="checkout"
            element={
              <Checkout />
            }
          />
          <Route
            path="/settings/profile"
            element={
              <ProfilePage />
            }
          />
        </Route>
        {/* Page Not Found */}
        <Route path="*" element={<PageNotFound path={"/"} />} />
      </Route>
      {/* Adminpages path */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />} errorElement={<ErrorHandler path={"/admin"} />}>
          <Route
            index
            element={
              <AdminDashboard />
            }
          />
          <Route
            path="products"
            element={
              <AdminProducts />
            }
          />
          <Route
            path="categories"
            element={
              <AdminCategories />
            }
          />
          <Route
            path="hero-slides"
            element={
              <AdminHeroSlides />
            }
          />
          <Route
            path="orders"
            element={
              <OrdersPage />
            }
          />
          <Route
            path="users"
            element={
              <UsersPage />
            }
          />
          <Route
            path="reviews"
            element={
              <ReviewsPage />
            }
          />
          <Route
            path="coupons"
            element={
              <CouponsPage />
            }
          />
          <Route
            path="analytics"
            element={
              <AnalyticsPage />
            }
          />
          <Route
            path="settings"
            element={
              <AdminSettingsPage />
            }
          />
          {/* Page Not Found */}
          <Route path="*" element={<PageNotFound path={"/admin"} />} />
        </Route>
      </Route>

      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage mode="user" />} />
      <Route path="/admin/login" element={<LoginPage mode="admin" />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />
      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />

      {/* Page Not Found */}
      {/* <Route path="*" element={<PageNotFound path={"/"} />} /> */}
    </>
  )
);

export default router;

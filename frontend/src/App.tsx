import { useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { restoreAuth } from './features/auth/authSlice';
import { createAppTheme } from './theme/index';
import { useQRTracking } from './hooks/useQRTracking';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './features/auth/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './features/dashboard/Dashboard';
import MenuPage from './features/menu/MenuPage';
import CategoryPage from './features/category/CategoryPage';
import ItemPage from './features/item/ItemPage';
import Restaurant from './features/restaurant/Restaurant';
import ItemTagPage from './features/itemTag/ItemTagPage';
import CampaignPage from './features/campaign/CampaignPage';
import SimpleCustomerHomepage from './components/customer/SimpleCustomerHomepage';
import CustomerMenuDetail from './components/customer/CustomerMenuDetail';
import CustomerItemDetail from './components/customer/CustomerItemDetail';
import NotFound from './components/NotFound';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);
  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);
  const location = useLocation();

  // Initialize QR tracking system
  useQRTracking();

  // Check if current route is admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Only restore auth for admin routes
    if (isAdminRoute) {
      dispatch(restoreAuth());
    }
  }, [dispatch, isAdminRoute]);

  useEffect(() => {
    // Force theme attribute on HTML element for CSS selectors
    if (process.env.NODE_ENV === 'development') {
      console.log('Setting theme mode:', themeMode);
    }
    document.documentElement.setAttribute('data-mui-color-scheme', themeMode);
    document.documentElement.setAttribute('data-theme', themeMode);
    document.body.className = themeMode;
    
    // Force scrollbar refresh
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      document.body.style.overflow = '';
    }, 10);
  }, [themeMode]);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
      <GlobalStyles
        styles={{
          // SIMPLE: Basic scroll system - only essentials
          body: {
            overflowX: 'hidden', // No horizontal scroll
          },
        }}
      />
      <Routes>
        {/* Public Routes - Customer-facing QR menu application */}
        <Route path="/" element={<SimpleCustomerHomepage />} />
        <Route path="/menu/:menuId" element={<CustomerMenuDetail />} />
        <Route path="/item/:itemId" element={<CustomerItemDetail />} />
        
        {/* Admin Routes - Protected, authentication required */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="campaign" element={<CampaignPage />} />
          <Route path="category/:menuId" element={<CategoryPage />} />
          <Route path="item/:categoryId" element={<ItemPage />} />
          <Route path="restaurant" element={<Restaurant />} />
          <Route path="item-tag" element={<ItemTagPage />} />
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
        
        {/* 404 Catch-all Route - Must be last */}
        <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
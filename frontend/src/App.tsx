import { useEffect, useMemo, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CircularProgress, CssBaseline, GlobalStyles } from '@mui/material';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { restoreAuth } from './features/auth/authSlice';
import { createAppTheme } from './theme';
import { useQRTracking } from './hooks/useQRTracking';

// Customer Components (Always loaded)
import { MUILandingPage } from './features/customer-mui';
import MenuDetailPage from './features/customer-mui/menu/MenuDetailPage';
import ItemDetailPage from './features/customer-mui/item/ItemDetailPage';
import NotFound from './components/NotFound';
import ErrorBoundary from './components/common/ErrorBoundary';

// Admin Components (Lazy loaded)
const ProtectedRoute = lazy(() => import('./components/auth/ProtectedRoute'));
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));
const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));
const MenuPage = lazy(() => import('./features/menu/MenuPage'));
const CategoryPage = lazy(() => import('./features/category/CategoryPage'));
const ItemPage = lazy(() => import('./features/item/ItemPage'));
const Restaurant = lazy(() => import('./features/restaurant/Restaurant'));
const ItemTagPage = lazy(() => import('./features/itemTag/ItemTagPage'));
const CampaignPage = lazy(() => import('./features/campaign/CampaignPage'));

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
        <Route path="/" element={<MUILandingPage />} />
        <Route path="/menu/:menuId" element={<MenuDetailPage />} />
        <Route path="/item/:itemId" element={<ItemDetailPage />} />
        
        {/* Admin Routes - Protected, authentication required */}
        <Route path="/admin/login" element={
          <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>}>
            <LoginPage />
          </Suspense>
        } />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <CircularProgress />
            </Box>}>
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            </Suspense>
          }
        >
          <Route path="dashboard" element={
            <Suspense fallback={<CircularProgress />}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="menu" element={
            <Suspense fallback={<CircularProgress />}>
              <MenuPage />
            </Suspense>
          } />
          <Route path="campaign" element={
            <Suspense fallback={<CircularProgress />}>
              <CampaignPage />
            </Suspense>
          } />
          <Route path="category/:menuId" element={
            <Suspense fallback={<CircularProgress />}>
              <CategoryPage />
            </Suspense>
          } />
          <Route path="item/:categoryId" element={
            <Suspense fallback={<CircularProgress />}>
              <ItemPage />
            </Suspense>
          } />
          <Route path="restaurant" element={
            <Suspense fallback={<CircularProgress />}>
              <Restaurant />
            </Suspense>
          } />
          <Route path="item-tag" element={
            <Suspense fallback={<CircularProgress />}>
              <ItemTagPage />
            </Suspense>
          } />
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
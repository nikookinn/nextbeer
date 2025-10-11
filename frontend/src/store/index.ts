import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import themeReducer from '../features/theme/themeSlice';
import { authApi } from '../api/authApi';
import { dashboardApi } from '../api/dashboardApi';
import { publicApi } from '../api/publicApi';
import { restaurantApi } from '../api/restaurantApi';
import { campaignApi } from '../api/campaignApi';
import { customerApi } from '../api/customerApi';
import { qrTrackingApi } from '../api/qrTrackingApi';
// Import for side effects (to register endpoints)
import '../api/menuApi';
import '../api/categoryApi';
import '../api/itemApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    theme: themeReducer,
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
    [restaurantApi.reducerPath]: restaurantApi.reducer,
    [campaignApi.reducerPath]: campaignApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [qrTrackingApi.reducerPath]: qrTrackingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setCredentials'],
        ignoredPaths: ['dashboard.customDates'], // For date serialization
      },
    })
      .concat(authApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(publicApi.middleware)
      .concat(restaurantApi.middleware)
      .concat(campaignApi.middleware)
      .concat(customerApi.middleware)
      .concat(qrTrackingApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

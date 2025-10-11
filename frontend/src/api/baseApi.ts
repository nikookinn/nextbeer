import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/index';
import { logout, setCredentials } from '../features/auth/authSlice';
import { AuthResponse } from '../types/auth.types';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  credentials: 'same-origin', // Same-origin cookies için
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    // Don't set Content-Type by default - let individual endpoints handle it
    // This prevents issues with FormData requests in Docker environment
    headers.set('Accept', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized - Token refresh
  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    
    if (refreshToken) {
      try {
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const authData = refreshResult.data as AuthResponse;
          api.dispatch(setCredentials(authData));
          // Retry the original query with new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh failed, logout user
          api.dispatch(logout());
        }
      } catch (error) {
        // Network error during refresh, logout user
        if (import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true') {
          console.error('Token refresh failed:', error);
        }
        api.dispatch(logout());
      }
    } else {
      // No refresh token, logout user
      api.dispatch(logout());
    }
  }

  // Production error logging
  if (result.error && import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true') {
    // Log errors to monitoring service (Sentry, LogRocket, etc.)
    console.error('API Error:', {
      url: typeof args === 'string' ? args : args.url,
      method: typeof args === 'string' ? 'GET' : args.method,
      status: result.error.status,
      data: result.error.data,
    });
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Dashboard', 'Menu', 'Category', 'Item', 'Restaurant', 'ItemTag'],
  endpoints: () => ({}),
});

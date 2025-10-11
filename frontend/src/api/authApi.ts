import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginRequest, AuthResponse, RefreshTokenRequest } from '../types/auth.types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/auth' }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    refresh: builder.mutation<AuthResponse, RefreshTokenRequest>({
      query: (refreshToken) => ({
        url: '/refresh',
        method: 'POST',
        body: refreshToken,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation, useLogoutMutation } = authApi;

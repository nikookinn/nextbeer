import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// QR Tracking API - Public endpoint, no authentication required
export const qrTrackingApi = createApi({
  reducerPath: 'qrTrackingApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/v1',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['QRTracking'],
  endpoints: (builder) => ({
    trackQRScan: builder.mutation<void, void>({
      query: () => ({
        url: '/qr-track',
        method: 'POST',
      }),
      invalidatesTags: ['QRTracking'],
    }),
  }),
});

export const {
  useTrackQRScanMutation,
} = qrTrackingApi;

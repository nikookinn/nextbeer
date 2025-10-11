import { useEffect, useRef } from 'react';
import { useTrackQRScanMutation } from '../api/qrTrackingApi';

const QR_TRACKING_SESSION_KEY = 'qr_tracked';
const QR_SOURCE_PARAM = 'source';
const QR_SOURCE_VALUE = 'qr';

export const useQRTracking = () => {
  const [trackQRScan] = useTrackQRScanMutation();
  const hasTracked = useRef(false);

  useEffect(() => {
    // Prevent multiple executions in React Strict Mode
    if (hasTracked.current) {
      return;
    }

    // Check if already tracked in this session
    const alreadyTracked = sessionStorage.getItem(QR_TRACKING_SESSION_KEY);
    if (alreadyTracked) {
      return;
    }

    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sourceParam = urlParams.get(QR_SOURCE_PARAM);

    if (sourceParam === QR_SOURCE_VALUE) {
      hasTracked.current = true;

      // Track QR scan
      trackQRScan()
        .unwrap()
        .then(() => {
          console.log('QR scan tracked successfully');
          // Mark as tracked in session storage
          sessionStorage.setItem(QR_TRACKING_SESSION_KEY, 'true');
        })
        .catch((error) => {
          // Silent fail - log error but don't show to user
          console.error('QR tracking failed:', error);
        })
        .finally(() => {
          // Clean URL - remove source parameter
          cleanURL();
        });
    }
  }, [trackQRScan]);

  const cleanURL = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete(QR_SOURCE_PARAM);
      
      // Use replaceState to update URL without page reload
      const cleanedURL = url.pathname + (url.search || '');
      window.history.replaceState(null, '', cleanedURL);
    } catch (error) {
      console.error('Failed to clean URL:', error);
    }
  };
};

export default useQRTracking;

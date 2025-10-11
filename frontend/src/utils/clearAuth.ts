// Manual auth cleanup utility
export const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  console.log('🔐 Auth data cleared from localStorage');
};

// For development environment usage
if (typeof window !== 'undefined') {
  (window as any).clearAuth = clearAuthData;
}

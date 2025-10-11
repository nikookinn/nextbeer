import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse, User } from '../../types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Token'ı kontrol et ve geçersizse temizle
const checkTokenValidity = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    try {
      // JWT token'ın payload kısmını decode et
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Token süresi dolmuşsa temizle
      if (payload.exp && payload.exp < currentTime) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        return null;
      }
      return token;
    } catch (error) {
      // Token geçersizse temizle
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return null;
    }
  }
  return null;
};

const validToken = checkTokenValidity();

const initialState: AuthState = {
  user: validToken ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  accessToken: validToken,
  refreshToken: validToken ? localStorage.getItem('refreshToken') : null,
  isAuthenticated: !!validToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { accessToken, refreshToken, username, roles } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = { username, roles };
      state.isAuthenticated = true;
      state.error = null;
      
      // Persist tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify({ username, roles }));
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear persisted data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    restoreAuth: (state) => {
      const userStr = localStorage.getItem('user');
      if (userStr && state.accessToken) {
        state.user = JSON.parse(userStr);
        state.isAuthenticated = true;
      }
    },
  },
});

export const { setCredentials, logout, setLoading, setError, restoreAuth } = authSlice.actions;
export default authSlice.reducer;

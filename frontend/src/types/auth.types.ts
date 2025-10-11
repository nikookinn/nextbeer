export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  username: string;
  roles: string[];
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface User {
  username: string;
  roles: string[];
}

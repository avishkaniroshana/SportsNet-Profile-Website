export interface SignupRequest {
  fullName: string;
  email: string;
  telephone: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  userId: string;
  fullName: string;
  email: string;
}

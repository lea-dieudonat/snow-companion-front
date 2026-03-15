export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  favoriteStations?: string[];
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

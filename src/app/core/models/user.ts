export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  firstname?: string | null;
  middlename?: string | null;
  lastname?: string | null;
  second_lastname?: string | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  email: string;
  username: string;
  firstname: string | null;
  middlename: string | null;
  lastname: string | null;
  second_lastname: string | null;
}

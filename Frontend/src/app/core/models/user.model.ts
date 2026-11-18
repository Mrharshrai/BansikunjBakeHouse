export type Role = 'customer' | 'admin' | 'staff' | 'delivery_agent';

export interface UserSummary {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  is_email_verified: boolean;
}

export interface UserOut extends UserSummary {
  phone?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: string;
}

export interface AuthBundle {
  user: UserSummary;
  tokens: AuthTokenPair;
}

export interface TokenBundle { tokens: AuthTokenPair; }

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { email: string; password: string; full_name: string; phone?: string | null; }
export interface UserProfileUpdate { full_name?: string | null; phone?: string | null; }
export interface PasswordChangeRequest { current_password: string; new_password: string; }

export interface User {
  id: string;
  username: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: null | User;
}

import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  role?: string;
  roles?: string[];
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export interface TokenPayload {
  sub: string; // user id
  email: string;
  iat?: number; // issued at
  exp?: number; // expires at
}

export interface AuthTokens {
  accessToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
  };
  message: string;
}

import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../application/auth/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from '../presentation/auth/auth.controller';
import { RepositoriesModule } from '../infrastructure/repositories.module';
import { jwtConfig } from '../config/jwt.config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { OwnershipGuard } from './guards/ownership.guard';

@Module({
  imports: [PassportModule, JwtModule.register(jwtConfig), RepositoriesModule],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
    LocalAuthGuard,
    OwnershipGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard, LocalAuthGuard, OwnershipGuard],
})
export class AuthModule {}

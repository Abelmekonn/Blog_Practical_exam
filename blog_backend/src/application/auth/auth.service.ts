import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { AuthTokens, TokenPayload } from '../../domain/auth/auth.types';
import { USER_REPOSITORY } from '../../domain/users/user.repository.interface';
import { IUserRepository } from '../../domain/users/user.repository.interface';
import { User } from '../../domain/users/user.entity';
import { UserAlreadyExistsException } from '../../core/exceptions';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(user: User): Promise<AuthTokens> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
    };

    const { password, ...userWithoutPassword } = user;

    return {
      accessToken: this.jwtService.sign(payload),
      user: userWithoutPassword,
      message: 'Login successful',
    };
  }

  async register(email: string, password: string, name: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new UserAlreadyExistsException(email);
    }

    const hashedPassword = await hash(password, 10);

    return this.userRepository.create({
      email,
      password: hashedPassword,
      username: name,
    });
  }
}

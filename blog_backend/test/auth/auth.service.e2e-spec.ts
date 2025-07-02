import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../src/application/auth/auth.service';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../src/domain/users/user.repository.interface';
import { User } from '../../src/domain/users/user.entity';
import { UserAlreadyExistsException } from '../../src/core/exceptions';
import { hash, compare } from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');
const mockHash = hash as jest.MockedFunction<typeof hash>;
const mockCompare = compare as jest.MockedFunction<typeof compare>;

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<IUserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword123',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(USER_REPOSITORY);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      mockCompare.mockResolvedValue(true as never);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toEqual(mockUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(mockCompare).toHaveBeenCalledWith(
        'password123',
        'hashedPassword123',
      );
    });

    it('should return null when user does not exist', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(
        'nonexistent@example.com',
        'password123',
      );

      expect(result).toBeNull();
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
      expect(mockCompare).not.toHaveBeenCalled();
    });

    it('should return null when password is invalid', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      mockCompare.mockResolvedValue(false as never);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
      expect(mockCompare).toHaveBeenCalledWith(
        'wrongpassword',
        'hashedPassword123',
      );
    });

    it('should handle empty email', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('', 'password123');

      expect(result).toBeNull();
      expect(userRepository.findByEmail).toHaveBeenCalledWith('');
    });

    it('should handle empty password', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      mockCompare.mockResolvedValue(false as never);

      const result = await service.validateUser('test@example.com', '');

      expect(result).toBeNull();
      expect(mockCompare).toHaveBeenCalledWith('', 'hashedPassword123');
    });
  });

  describe('login', () => {
    it('should return auth tokens with user data', async () => {
      const expectedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
      jwtService.sign.mockReturnValue(expectedToken);

      const result = await service.login(mockUser);

      expect(result).toEqual({
        accessToken: expectedToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
        },
        message: 'Login successful',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should exclude password from returned user data', async () => {
      const expectedToken = 'jwt-token';
      jwtService.sign.mockReturnValue(expectedToken);

      const result = await service.login(mockUser);

      expect(result.user).not.toHaveProperty('password');
      expect(Object.keys(result.user)).toEqual([
        'id',
        'email',
        'username',
        'createdAt',
        'updatedAt',
      ]);
    });
  });

  describe('register', () => {
    it('should create new user successfully', async () => {
      const email = 'new@example.com';
      const password = 'password123';
      const name = 'New User';
      const hashedPassword = 'hashedPassword123';

      userRepository.findByEmail.mockResolvedValue(null);
      mockHash.mockResolvedValue(hashedPassword as never);
      userRepository.create.mockResolvedValue(mockUser);

      const result = await service.register(email, password, name);

      expect(result).toEqual(mockUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockHash).toHaveBeenCalledWith(password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        email,
        password: hashedPassword,
        username: name,
      });
    });

    it('should throw UserAlreadyExistsException when email is taken', async () => {
      const email = 'existing@example.com';
      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register(email, 'password123', 'New User'),
      ).rejects.toThrow(UserAlreadyExistsException);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockHash).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should handle registration with minimum data', async () => {
      const email = 'minimal@example.com';
      const password = 'pwd';
      const name = 'U';
      const hashedPassword = 'hashedPwd';

      userRepository.findByEmail.mockResolvedValue(null);
      mockHash.mockResolvedValue(hashedPassword as never);
      userRepository.create.mockResolvedValue({
        ...mockUser,
        email,
        username: name,
      });

      const result = await service.register(email, password, name);

      expect(result.email).toBe(email);
      expect(result.username).toBe(name);
      expect(mockHash).toHaveBeenCalledWith(password, 10);
    });
  });
});

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from '../../application/auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate user with email and password to receive JWT token',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Login successful - returns JWT token and user data',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 'uuid-string',
          email: 'user@example.com',
          name: 'John Doe',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid email or password',
        error: 'Unauthorized',
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({
    summary: 'User registration',
    description: 'Create a new user account with email, password, and name',
  })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    schema: {
      example: {
        id: 'uuid-string',
        email: 'user@example.com',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or user already exists',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'email must be a valid email',
          'password must be longer than 6 characters',
        ],
        error: 'Bad Request',
      },
    },
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.name,
    );
    return { id: user.id, email: user.email };
  }

  @ApiOperation({
    summary: 'Get current user profile',
    description: "Retrieve the authenticated user's profile information",
  })
  @ApiOkResponse({
    description: 'User profile retrieved successfully',
    schema: {
      example: {
        id: 'uuid-string',
        email: 'user@example.com',
        name: 'John Doe',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'JWT token missing or invalid',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = req.user;
    return user;
  }

  @ApiOperation({
    summary: 'User logout',
    description: 'Logout user (client should remove token)',
  })
  @ApiOkResponse({
    description: 'Logout successful',
    schema: {
      example: {
        message: 'Logout successful',
      },
    },
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout() {
    // In JWT-based auth, logout is typically handled client-side
    // by removing the token. This endpoint is for consistency.
    return {
      message: 'Logout successful',
    };
  }
}

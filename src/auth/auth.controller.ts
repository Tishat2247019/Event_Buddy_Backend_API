import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  register(@Body() dto: RegisterDto): Promise<{
    message: string;
    user: { id: number; email: string; role: string };
  }> {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user and return a JWT token' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      example: {
        access_token: 'jwt_token_here',
        user: {
          id: 1,
          email: 'user@example.com',
          role: 'user',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout a user and invalidate the token' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
    schema: {
      example: {
        message: 'User logged out successfully',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Access token not found in Authorization header',
  })
  async logout(@Req() req): Promise<{ message: string }> {
    const userId = req.user.userId;
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (!accessToken) {
      throw new ForbiddenException(
        'Access token not found in Authorization header',
      );
    }

    const logout = await this.authService.logout(userId, accessToken);
    return logout;
  }
}

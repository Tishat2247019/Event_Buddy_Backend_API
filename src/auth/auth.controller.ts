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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('logout')
  async logout(@Req() req): Promise<{ message }> {
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

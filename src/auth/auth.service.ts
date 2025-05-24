import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { BlacklistToken } from './entities/blackListToken.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(BlacklistToken)
    private readonly blackListTokenRepository: Repository<BlacklistToken>,
  ) {}

  async register(dto: RegisterDto) {
    const userExists = await this.usersService.findByEmail(dto.email);
    if (userExists) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    return {
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    const upLastLogin = this.usersService.upLastLogin(payload.sub, new Date());

    return {
      access_token: token,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async logout(userId: number, accessToken: string): Promise<{ message }> {
    const decoded = this.jwtService.decode(accessToken) as { exp: number };
    const expiresAt = new Date(decoded.exp * 1000);

    const logout = await this.blackListTokenRepository.save({
      token: accessToken,
      expiresAt,
    });
    await this.usersService.upLastLogout(userId, new Date());
    if (logout) {
      return { message: 'Succesffully logged out' };
    } else {
      return {
        message: 'Something error in loggin out',
      };
    }
  }
}

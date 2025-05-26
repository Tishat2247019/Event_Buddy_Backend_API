import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @Post(':eventId')
  async bookSeats(
    @Request() req,
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body('seats') seats: number,
  ) {
    const userId = req.user.userId;
    return this.bookingsService.bookSeats(userId, eventId, seats);
  }

  @Get('mine')
  async getMyBookings(@Request() req) {
    const userId = req.user.id;
    return this.bookingsService.getMyBookings(userId);
  }
}

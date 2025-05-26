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

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post(':eventId')
  async bookSeats(
    @Request() req,
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body('seats') seats: number,
  ) {
    const userId = req.user.userId;
    // console.log(userId);
    return this.bookingsService.bookSeats(userId, eventId, seats);
  }

  @Get('mine')
  async getMyBookings(@Request() req) {
    const userId = req.user.id;
    return this.bookingsService.getMyBookings(userId);
  }
}

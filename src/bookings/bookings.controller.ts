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
import { Booking } from './entities/booking.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { bookEventDto } from './dto/book_event.dto';

@ApiTags('bookings')
@ApiBearerAuth()
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @Post(':eventId')
  @ApiOperation({ summary: 'Book seats for an event (admin or user)' })
  @ApiParam({
    name: 'eventId',
    type: Number,
    description: 'ID of the event to book seats for',
  })
  @ApiBody({ type: bookEventDto })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    type: Booking,
  })
  @ApiResponse({ status: 400, description: 'Validation error or overbooking' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async bookSeats(
    @Request() req,
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() dto: bookEventDto,
  ) {
    const userId = req.user.userId;
    return this.bookingsService.bookSeats(userId, eventId, dto.seats);
  }

  @Roles('admin', 'user')
  @Get('mine')
  @ApiOperation({ summary: 'Get all bookings of the logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'List of user bookings',
    type: [Booking],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  async getMyBookings(@Request() req) {
    const userId = req.user.id;
    return this.bookingsService.getMyBookings(userId);
  }
}

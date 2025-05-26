import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { EventEntity } from 'src/events/entities/event.entity';
import { BlacklistToken } from 'src/auth/entities/blackListToken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, EventEntity, BlacklistToken])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}

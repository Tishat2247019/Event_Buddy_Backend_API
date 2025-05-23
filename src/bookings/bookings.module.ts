import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { EventEntity } from 'src/events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, EventEntity])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}

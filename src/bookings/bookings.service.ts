import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Event } from 'src/events/entities/event.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Event) private eventRepo: Repository<Event>,
  ) {}

  async bookSeats(userId: number, eventId: number, seats: number) {
    if (seats < 1 || seats > 4) {
      throw new BadRequestException('You can only book between 1 and 4 seats.');
    }

    const event = await this.eventRepo.findOne({
      where: { id: eventId },
      relations: ['bookings'],
    });

    if (!event) {
      throw new NotFoundException('Event not found.');
    }

    const now = new Date();
    if (event.date <= now) {
      throw new BadRequestException('Cannot book seats for past events.');
    }

    const totalBookedSeats = event.bookings.reduce(
      (sum, b) => sum + b.seats,
      0,
    );
    if (totalBookedSeats + seats > event.capacity) {
      throw new BadRequestException('Not enough seats available.');
    }

    const booking = this.bookingRepo.create({
      user: { id: userId },
      event: { id: eventId },
      seats,
    });

    return this.bookingRepo.save(booking);
  }

  async getMyBookings(userId: number) {
    return this.bookingRepo.find({
      where: { user: { id: userId } },
      relations: ['event'],
      order: { createdAt: 'DESC' },
    });
  }
}

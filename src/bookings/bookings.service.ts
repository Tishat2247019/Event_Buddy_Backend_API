import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { EventEntity } from 'src/events/entities/event.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(EventEntity) private eventRepo: Repository<EventEntity>,
  ) {}

  async bookSeats(userId: number, eventId: number, seats: number) {
    if (seats < 1 || seats > 4) {
      throw new BadRequestException('You can only book between 1 and 4 seats.');
    }

    const event = await this.eventRepo.findOne({
      where: { id: eventId },
      relations: ['bookings'],
    });

    // console.log(event);

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

    const userSeatsBooked = event.bookings
      .filter((b) => b.userId === userId)
      .reduce((sum, b) => sum + b.seats, 0);

    // console.log(userSeatsBooked);

    if (userSeatsBooked + seats > 4) {
      throw new BadRequestException(
        `You have already booked ${userSeatsBooked} seat(s). You can only book a total of 4 seats per event.`,
      );
    }

    // const booking = this.bookingRepo.create({
    //   user: { id: userId },
    //   event: { id: eventId },
    //   seats,
    // });

    const existingBooking = await this.bookingRepo.findOne({
      where: { user: { id: userId }, event: { id: eventId } },
    });

    if (existingBooking) {
      const oldTotalBookedSeats = existingBooking.seats;
      existingBooking.seats += seats;
      const updatedBooking = await this.bookingRepo.save(existingBooking);
      return {
        message: 'Booking updated',
        oldTotalSeats: oldTotalBookedSeats,
        newTotalSeats: updatedBooking.seats,
        booking: updatedBooking,
      };
    } else {
      const newBooking = this.bookingRepo.create({
        userId,
        eventId,
        seats,
      });
      return this.bookingRepo.save(newBooking);
    }
  }

  async getMyBookings(userId: number) {
    return this.bookingRepo.find({
      where: { user: { id: userId } },
      relations: ['event'],
      order: { createdAt: 'DESC' },
    });
  }
  async cancelBooking(
    userId: number,
    bookingId: number,
  ): Promise<{ message: string }> {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.user.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to cancel this booking',
      );
    }

    await this.bookingRepo.remove(booking);
    return { message: 'Booking cancelled successfully' };
  }
}

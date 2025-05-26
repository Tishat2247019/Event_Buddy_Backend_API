import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { EventEntity } from './entities/event.entity';
import { CreateEventDto } from './dto/create_event.dto';
import { UpdateEventDto } from './dto/update_event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepo: Repository<EventEntity>,
  ) {}

  async create(adminId: number, data: CreateEventDto): Promise<EventEntity> {
    const event = this.eventRepo.create({
      ...data,
      createdBy: adminId,
      date: new Date(data.date),
    });
    // console.log(data);
    return this.eventRepo.save(event);
  }

  async update(
    id: number,
    adminId: number,
    data: UpdateEventDto,
  ): Promise<{ message: string; event: EventEntity }> {
    const event = await this.eventRepo.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    Object.assign(event, {
      ...data,
      date: data.date ? new Date(data.date) : event.date,
    });
    event.updatedBy = adminId;
    const updatedEvent = await this.eventRepo.save(event);

    return {
      message: `Event with id ${id} successfully updated`,
      event: updatedEvent,
    };
  }

  async delete(id: number): Promise<{ message }> {
    await this.eventRepo.delete(id);
    return { message: `Event with id ${id} deleted successfully` };
  }

  async findById(id: number): Promise<EventEntity> {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async getUpcoming(): Promise<EventEntity[]> {
    return this.eventRepo.find({
      where: { date: MoreThan(new Date()) },
      order: { date: 'ASC' },
    });
  }

  async getPrevious(): Promise<EventEntity[]> {
    return this.eventRepo.find({
      where: { date: LessThan(new Date()) },
      order: { date: 'DESC' },
    });
  }

  async getAll(): Promise<EventEntity[]> {
    return this.eventRepo.find({
      order: { date: 'DESC' },
      relations: ['bookings'],
    });
  }

  async getEventStats(
    eventId: number,
  ): Promise<{ remainingSeats: number; totalRegistered: number }> {
    const event = await this.eventRepo.findOne({
      where: { id: eventId },
      relations: ['bookings'],
    });
    if (!event) {
      throw new NotFoundException(`Event with id ${eventId} not found`);
    }
    const totalBooked = event.bookings.reduce((sum, b) => sum + b.seats, 0);
    return {
      remainingSeats: event.capacity - totalBooked,
      totalRegistered: totalBooked,
    };
  }
}

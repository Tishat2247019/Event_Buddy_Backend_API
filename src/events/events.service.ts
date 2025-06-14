import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { EventEntity } from './entities/event.entity';
import { CreateEventDto } from './dto/create_event.dto';
import { UpdateEventDto } from './dto/update_event.dto';
import { PublicEventDto } from './dto/public_event_details.dto';
import { EventPhoto } from './entities/event_photo.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepo: Repository<EventEntity>,
    @InjectRepository(EventPhoto)
    private readonly photoRepo: Repository<EventPhoto>,
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

    if (data.location) {
      event.location = {
        ...(event.location ?? {}),
        ...data.location,
      };
    }
    const { location, ...rest } = data;
    Object.assign(event, {
      ...rest,
      date: data.date ? new Date(data.date) : event.date,
    });

    event.updatedBy = adminId;

    await this.eventRepo.save(event);

    const completeEvent = await this.eventRepo.findOne({ where: { id } });

    return {
      message: `Event with id ${id} successfully updated`,
      event: completeEvent!,
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

  async getAllEventsAdmin(): Promise<EventEntity[]> {
    return this.eventRepo.find({
      order: { date: 'DESC' },
      relations: ['bookings', 'photos'],
    });
  }

  async getAllEventsPublic(): Promise<PublicEventDto[]> {
    const events = await this.eventRepo.find({
      order: { date: 'DESC' },
    });

    return events.map((event) => ({
      id: event.id,
      name: event.name,
      description: event.description,
      date: event.date,
      capacity: event.capacity,
      location: event.location,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }));
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

  async searchEvents(query: string): Promise<PublicEventDto[]> {
    if (!query) {
      return [];
    }

    const events = await this.eventRepo
      .createQueryBuilder('event')
      .where('event.name ILIKE :q OR event.description ILIKE :q', {
        q: `%${query}%`,
      })
      .getMany();

    return events.map((event) => ({
      id: event.id,
      name: event.name,
      description: event.description,
      date: event.date,
      capacity: event.capacity,
      location: event.location,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }));
  }

  async addPhoto(eventId: number, photoPath: string): Promise<EventPhoto> {
    const photo = this.photoRepo.create({ eventId, url: photoPath });
    return this.photoRepo.save(photo);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { EventEntity } from './entities/event.entity';
import { CreateEventDto } from './dto/create_event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepo: Repository<EventEntity>,
  ) {}

  async create(data: CreateEventDto): Promise<EventEntity> {
    const event = this.eventRepo.create({
      ...data,
      date: new Date(data.date),
    });
    console.log(data);
    return this.eventRepo.save(event);
  }

  async update(
    id: number,
    data: Partial<EventEntity>,
  ): Promise<{ message: string; event: EventEntity }> {
    await this.eventRepo.update(id, data);
    const event = await this.findById(id);
    return {
      message: `Event with id ${id} successffully updated`,
      event,
    };
  }

  async delete(id: number) {
    await this.eventRepo.delete(id);
    return { message: 'Event deleted successfully' };
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
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  async create(data: Partial<Event>) {
    const event = this.eventRepo.create(data);
    return this.eventRepo.save(event);
  }

  async update(id: number, data: Partial<Event>) {
    await this.eventRepo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number) {
    await this.eventRepo.delete(id);
    return { message: 'Event deleted successfully' };
  }

  async findById(id: number): Promise<Event> {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async getUpcoming(): Promise<Event[]> {
    return this.eventRepo.find({
      where: { date: MoreThan(new Date()) },
      order: { date: 'ASC' },
    });
  }

  async getPrevious(): Promise<Event[]> {
    return this.eventRepo.find({
      where: { date: LessThan(new Date()) },
      order: { date: 'DESC' },
    });
  }

  async getAll(): Promise<Event[]> {
    return this.eventRepo.find({ order: { date: 'DESC' } });
  }
}

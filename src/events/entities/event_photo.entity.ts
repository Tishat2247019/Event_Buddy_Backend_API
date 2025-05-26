import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EventEntity } from 'src/events/entities/event.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('event_photos')
export class EventPhoto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the photo',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'uploads/events/photo-12345.jpg',
    description: 'Relative path to the uploaded event photo on the server',
  })
  @Column()
  url: string;

  @ApiProperty({
    example: 2,
    description: 'ID of the event this photo is associated with',
  })
  @Column()
  eventId: number;

  @ManyToOne(() => EventEntity, (event) => event.photos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  event: EventEntity;
}

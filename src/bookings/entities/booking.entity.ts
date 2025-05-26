import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { EventEntity } from 'src/events/entities/event.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('bookings')
export class Booking {
  @ApiProperty({ example: 1, description: 'Unique ID of the booking' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 2,
    description: 'ID of the user who made the booking',
  })
  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ example: 5, description: 'ID of the event being booked' })
  @Column({ nullable: true })
  eventId: number;

  @ManyToOne(() => EventEntity, (event) => event.bookings)
  @JoinColumn({ name: 'eventId' })
  event: EventEntity;

  @ApiProperty({ example: 3, description: 'Number of seats booked' })
  @Column()
  seats: number;

  @ApiProperty({
    example: '2025-05-26T10:20:30Z',
    description: 'Booking timestamp',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: null })
  updatedAt: Date;
}

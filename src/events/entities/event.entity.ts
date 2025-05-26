import { Booking } from 'src/bookings/entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

class Location {
  @ApiProperty({ example: 'Dhaka' })
  city: string;

  @ApiProperty({ example: '123 Main St' })
  street: string;

  @ApiProperty({ example: '1207' })
  postalCode: string;
}

@Entity('events')
export class EventEntity {
  @ApiProperty({ example: 1, description: 'Unique identifier for the event' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Tech Conference', description: 'Name of the event' })
  @Column()
  name: string;

  @ApiProperty({
    example: 'A conference for developers.',
    description: 'Detailed description of the event',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    example: '2025-06-15T10:00:00.000Z',
    description: 'Date and time of the event',
  })
  @Column({ type: 'timestamp' })
  date: Date;

  @ApiProperty({
    example: 100,
    description: 'Total number of seats available',
  })
  @Column()
  capacity: number;

  @ApiProperty({
    type: Location,
    description: 'Location of the event',
    required: false,
  })
  @Column({ type: 'json', nullable: true })
  location: Location;

  @ApiProperty({
    type: () => [Booking],
    description: 'List of bookings for the event',
  })
  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];

  @ApiProperty({
    example: 2,
    description: 'Admin user ID who created the event',
    required: false,
  })
  @Column({ nullable: true })
  createdBy: number;

  @ApiProperty({
    type: () => User,
    description: 'Admin user who created the event',
    required: false,
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  userC: User;

  @ApiProperty({
    example: '2025-05-26T10:00:00.000Z',
    description: 'Timestamp when the event was created',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    example: '2025-05-26T12:00:00.000Z',
    description: 'Timestamp when the event was last updated',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({
    example: 3,
    description: 'Admin user ID who last updated the event',
    required: false,
  })
  @Column({ nullable: true })
  updatedBy: number;

  @ApiProperty({
    type: () => User,
    description: 'Admin user who last updated the event',
    required: false,
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'updatedBy' })
  userU: User;
}

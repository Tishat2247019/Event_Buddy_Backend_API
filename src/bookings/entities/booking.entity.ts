import { User } from 'src/users/entities/user.entity';
import { EventEntity } from 'src/events/entities/event.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  eventId: number;

  @ManyToOne(() => EventEntity, (events) => events.bookings)
  @JoinColumn({ name: 'eventId' })
  event: EventEntity;

  @Column()
  seats: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}

import { User } from 'src/users/entities/user.entity';
<<<<<<< HEAD
import { Event } from 'src/events/entities/event.entity';
=======
import { EventEntity } from 'src/events/entities/event.entity';
>>>>>>> main
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
<<<<<<< HEAD
=======
  JoinColumn,
>>>>>>> main
} from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

<<<<<<< HEAD
  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @ManyToOne(() => Event, (event) => event.bookings)
  event: Event;
=======
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
>>>>>>> main

  @Column()
  seats: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}

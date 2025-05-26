import { Booking } from 'src/bookings/entities/booking.entity';
<<<<<<< HEAD
=======
import { User } from 'src/users/entities/user.entity';
>>>>>>> main
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
  city: string;
  street: string;
  postalCode: string;
}

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  capacity: number;

  @Column({ type: 'json', nullable: true })
  location: Location;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];

  @Column({ nullable: true })
  createdBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  userC: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updatedBy' })
  userU: User;
}

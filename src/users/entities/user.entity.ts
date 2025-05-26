import { ApiProperty } from '@nestjs/swagger';
import { Booking } from 'src/bookings/entities/booking.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export type UserRole = 'user' | 'admin';

@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: 'User ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Name of the user' })
  @Column()
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email of the user',
  })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ApiProperty({
    example: 'user',
    enum: ['user', 'admin'],
    description: 'Role of the user',
  })
  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: UserRole;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @ApiProperty({
    example: '2024-01-01T10:00:00.000Z',
    description: 'User creation timestamp',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-02T12:00:00.000Z',
    description: 'User update timestamp',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({
    example: '2024-01-03T09:00:00.000Z',
    description: 'Last login time',
    required: false,
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  lastlogin: Date;

  @ApiProperty({
    example: '2024-01-04T21:00:00.000Z',
    description: 'Last logout time',
    required: false,
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  lastLogout: Date;
}

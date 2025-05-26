import { ApiProperty } from '@nestjs/swagger';
import { Location } from '../entities/event.entity'; // Adjust path as needed

export class PublicEventDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the event' })
  id: number;

  @ApiProperty({ example: 'Tech Conference', description: 'Name of the event' })
  name: string;

  @ApiProperty({
    example: 'A conference for developers.',
    description: 'Detailed description of the event',
  })
  description: string;

  @ApiProperty({
    example: '2025-06-15T10:00:00.000Z',
    description: 'Date and time of the event',
  })
  date: Date;

  @ApiProperty({
    example: 150,
    description: 'Total number of seats available',
  })
  capacity: number;

  @ApiProperty({
    type: Location,
    description: 'Location details of the event',
  })
  location: Location;

  @ApiProperty({
    example: '2025-05-26T10:00:00.000Z',
    description: 'When the event was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-05-26T12:00:00.000Z',
    description: 'When the event was last updated',
  })
  updatedAt: Date;
}

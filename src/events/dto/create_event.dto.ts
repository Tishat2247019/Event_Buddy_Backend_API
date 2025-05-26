import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { eventLocationDto } from './event_location.dto';

export class CreateEventDto {
  @ApiProperty({ example: 'Tech Conference 2025', description: 'Event name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Annual tech event',
    description: 'Event description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: '2025-09-01T10:00:00Z',
    description: 'Event date (ISO format)',
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    example: 100,
    description: 'Total seat capacity for the event',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({
    type: eventLocationDto,
    description: 'Location details of the event',
  })
  @ValidateNested()
  @Type(() => eventLocationDto)
  @IsNotEmpty()
  location: eventLocationDto;

  @ApiProperty({
    example: '09:00 - 11:00',
    description: 'Event time slot (e.g., 09:00 - 11:00)',
  })
  @IsNotEmpty()
  @IsString()
  timeSlot: string;

  @ApiProperty({
    example: 'tech,conference,2025',
    description: 'Comma-separated tags',
  })
  @IsString()
  @IsNotEmpty()
  tags: string;
}

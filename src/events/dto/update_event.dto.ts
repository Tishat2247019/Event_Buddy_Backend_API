import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { eventLocationUpdateDto } from './update_event_location.dto';

export class UpdateEventDto {
  @ApiPropertyOptional({ example: 'Updated Event Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated event description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2025-09-10T15:00:00Z' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ type: eventLocationUpdateDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => eventLocationUpdateDto)
  location?: eventLocationUpdateDto;
}

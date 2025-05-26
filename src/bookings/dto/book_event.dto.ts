import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class bookEventDto {
  @ApiProperty({
    example: 3,
    description: 'Number of seats to book (must be at least 1)',
  })
  @IsInt()
  @Min(1)
  seats: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class eventLocationDto {
  @ApiProperty({ example: 'Dhaka', description: 'City of the event location' })
  @IsString()
  city: string;

  @ApiProperty({ example: '123 Main Street', description: 'Street address' })
  @IsString()
  street: string;

  @ApiProperty({ example: '1207', description: 'Postal code' })
  @IsString()
  postalCode: string;
}

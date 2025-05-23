import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  capacity: number;
}

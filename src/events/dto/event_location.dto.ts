import { IsString } from 'class-validator';

export class LocationDto {
  @IsString()
  city: string;

  @IsString()
  street: string;

  @IsString()
  postalCode: string;
}

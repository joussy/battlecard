import { IsString } from 'class-validator';

export class AddressAutocompleteDto {
  /** City name */
  @IsString()
  city: string;

  /** Street address */
  @IsString()
  street: string;

  /** ZIP code */
  @IsString()
  zipCode: string;

  /** Formatted address string */
  @IsString()
  formatted: string;
}

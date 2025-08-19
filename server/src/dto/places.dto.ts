import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class AutocompleteQueryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  q: string;
}

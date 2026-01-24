import { IsString } from 'class-validator';

export class OAuthLogoutDto {
  @IsString()
  url: string;
}

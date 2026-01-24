import { IsString } from 'class-validator';

export class OAuthLogoutDto {
  @IsString()
  url: string;
}

export class AvailableProvidersDto {
  @IsString({ each: true })
  providers: string[];
}

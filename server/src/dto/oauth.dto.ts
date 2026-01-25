import { IsString } from 'class-validator';

export class OAuthLogoutDto {
  @IsString()
  url: string;
}

export class AvailableProvidersDto {
  providers: OidcProviderDto[];
}

export class OidcProviderDto {
  @IsString()
  name: string;

  @IsString()
  displayName?: string;
}

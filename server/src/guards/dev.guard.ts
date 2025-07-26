import { ConfigService } from '@/services/config.service';
import { CanActivate, Injectable } from '@nestjs/common';

@Injectable()
export class DevOnlyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(): boolean {
    return this.configService.getConfig().environment === 'development';
  }
}

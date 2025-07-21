/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {
  Strategy,
  VerifyCallback,
  Profile as GoogleProfile,
} from 'passport-google-oauth20';
import { ConfigService } from '@/services/config.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.getConfig().googleClientId,
      clientSecret: configService.getConfig().googleClientSecret,
      callbackURL: configService.getConfig().googleCallbackUrl,
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ) {
    const { name, emails, id, photos } = profile;
    let picture: string | undefined = undefined;
    if (Array.isArray(photos) && photos.length > 0 && photos[0]?.value) {
      picture = photos[0].value;
    }
    const user = {
      googleId: id,
      email: emails && emails.length > 0 ? emails[0].value : undefined,
      name: name
        ? `${name.givenName ?? ''} ${name.familyName ?? ''}`.trim()
        : undefined,
      picture,
    };

    done(null, user);
  }
}

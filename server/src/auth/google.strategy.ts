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

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
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

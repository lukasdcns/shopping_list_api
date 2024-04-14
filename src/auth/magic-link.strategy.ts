import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import MagicLoginStrategy from 'passport-magic-login';
import { EmailService } from 'src/email/email.service';
import { AuthService } from './auth.service';

@Injectable()
export class MagicLinkStrategy extends PassportStrategy(MagicLoginStrategy) {
  constructor(
    private emailService: EmailService,
    private authService: AuthService,
  ) {
    super({
      secret:
        'DJScA6fuiglBiW2EV2P7Zpb9HHrKWHgTYsULUI6iVCQgP8ktVObmJumIkxWu90CVBAmpDA97aM9sWS4BciH0fCXg89XGXLCZIPVFGtOCsQq7ESKkt5TAo387RoUidqMI',
      callbackUrl: '/auth/login/callback',
      jwtOptions: {
        expiresIn: '5m',
      },
      sendMagicLink: async (destination, href) => {
        await this.emailService.sendMagicLink(destination, href);
      },
      verify: (playload, callback) => callback(null, this.validate(playload)),
    });
  }

  async validate(payload: { destination: string }) {
    const user = await this.authService.validateUser(payload.destination);

    return user;
  }
}

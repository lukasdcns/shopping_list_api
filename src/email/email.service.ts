import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendUserConfirmation(user: UserEntity) {
    await this.mailerService.sendMail({
      to: 'lukas.descoins.ld@gmail.com',
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'confirmation', // `.hbs` extension is appended automatically
      context: {
        name: 'Lukas',
      },
    });
  }

  async sendMagicLink(email: string, href: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your Magic Link',
      template: 'magic-link',
      context: {
        href,
      },
    });
  }
}

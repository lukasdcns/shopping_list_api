import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { EmailModule } from 'src/email/email.module';
import { MagicLinkStrategy } from './magic-link.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    EmailModule,
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret:
        'DJScA6fuiglBiW2EV2P7Zpb9HHrKWHgTYsULUI6iVCQgP8ktVObmJumIkxWu90CVBAmpDA97aM9sWS4BciH0fCXg89XGXLCZIPVFGtOCsQq7ESKkt5TAo387RoUidqMI',
      signOptions: { expiresIn: '7d' }, // e.g. 7d, 24h
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MagicLinkStrategy],
})
export class AuthModule {}

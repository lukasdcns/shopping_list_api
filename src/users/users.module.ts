import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, EmailModule],
  exports: [UsersService],
})
export class UsersModule {}

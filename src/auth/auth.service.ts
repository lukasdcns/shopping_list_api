import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(user: UserEntity): Promise<AuthEntity> {
    return {
      accessToken: this.jwtService.sign({
        userId: user.id,
        userEmail: user.email,
      }),
      userId: user.id,
    };
  }

  async validateUser(email: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException(`No user found for email: ${email}`);
    }

    return user;
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MagicLinkStrategy } from './magic-link.strategy';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private strategy: MagicLinkStrategy,
  ) {}

  @Post('magic-login')
  async magicLogin(
    @Body(new ValidationPipe()) { destination }: LoginDto,
    @Req() req,
    @Res() res,
  ): Promise<void> {
    const user = await this.authService.validateUser(destination);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.strategy.send(req, res);
  }

  @UseGuards(AuthGuard('magiclogin'))
  @Get('login/callback')
  async loginCallback(@Req() req, @Res() res) {
    const token = await this.authService.login(req.user);
    res.redirect(
      302,
      `${process.env.CLIENT_URL}/login/callback?access_token=${token.accessToken}&user_id=${token.userId}`,
    );
  }
}

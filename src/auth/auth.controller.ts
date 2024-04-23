import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MagicLinkStrategy } from './magic-link.strategy';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private httpService: HttpService,
    private readonly authService: AuthService,
    private strategy: MagicLinkStrategy,
  ) {}

  @Post('magic-login')
  async magicLogin(
    @Body(new ValidationPipe()) { destination }: LoginDto,
    @Req() req,
    @Res() res,
  ): Promise<void> {
    try {
      // Valider l'utilisateur
      const user = await this.authService.validateUser(destination);

      if (!user) {
        // Envoyer une requête POST pour créer l'utilisateur
        const createUserUrl = `${req.protocol}://${req.get('host')}/users`;

        const createUserResponse = await lastValueFrom(
          this.httpService
            .post(createUserUrl, { email: destination })
            .pipe(map((response) => response)),
        );

        if (createUserResponse.status === HttpStatus.CREATED) {
          // L'utilisateur a été créé avec succès, envoyer le token
          return this.strategy.send(req, res);
        } else {
          // Gérer les erreurs lors de la création de l'utilisateur
          throw new NotFoundException('Failed to create user');
        }
      }

      // L'utilisateur existe déjà, envoyer le token
      return this.strategy.send(req, res);
    } catch (error) {
      // Gérer les erreurs générales
      console.error('Error in magicLogin:', error.message);
      throw new NotFoundException('Failed to authenticate user');
    }
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

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { IJwtPayload } from '../models/jwt-paylod.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: authService.returnJwtExtractor(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  public async validate(jwtPayload: IJwtPayload) {
    const user = this.authService.validateUser(jwtPayload.userId);
    if (!user) {
      throw new HttpException(
        'Código de identificação de usuário inválido.',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }
}

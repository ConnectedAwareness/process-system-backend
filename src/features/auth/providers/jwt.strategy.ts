import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IToken } from '../../../../npm-interfaces/src/auth/token.interface';
import { Config } from '../../../environments/environments';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Config.AUTH_SECRETKEY,
    });
  }

  async validate(payload: IToken, done: Function) {
    const user = await this.authService.validateUser(payload);

    console.log(payload);

    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}
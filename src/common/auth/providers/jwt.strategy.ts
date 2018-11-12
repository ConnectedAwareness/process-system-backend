import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IToken } from '../../../../npm-interfaces/src/auth/token.interface';
import { Config } from '../../../environments/environments';
import { AuthorizationService } from '../services/authorization.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthorizationService,
    private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Config.AUTH_SECRETKEY,
    });
  }

  //called method from strategy, if token is already verified
  //TODO: decide, if user in token should be verified/validated in database as well
  async validate(payload: IToken, done: Function) {
    // const user = await this.authService.validateUser(payload);

    // if (!user) {
    //   return done(new UnauthorizedException(), false);
    // }
    // done(null, user);
    done(null, true);
  }
}
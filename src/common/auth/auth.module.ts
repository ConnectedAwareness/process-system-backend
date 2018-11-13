import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { Config } from '../../environments/environments';
import { RolesGuard } from './guards/roles.guard';
import { AuthorizationService } from './services/authorization.service';
import { JwtStrategy } from './providers/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: Config.AUTH_SECRETKEY,
      signOptions: {
        expiresIn: 3600,
      },
    })
  ],
  providers: [AuthorizationService, RolesGuard, JwtStrategy], //, ...rolesProvider, ...capabilitiesProvider],
  exports: [AuthorizationService, RolesGuard] //, ...rolesProvider, ...capabilitiesProvider]
})
export class AuthModule { }
import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './providers/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { UserMgmtModule } from '../userMgmt/userMgmt.module';

@Module({
  imports: [UserMgmtModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
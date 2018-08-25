import * as jwt from 'jsonwebtoken';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from '../../userMgmt/services/user.service';
import { Config } from '../../../environments/environments';
import { IUser } from '../../userMgmt/models/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) { }

  async createTokenAsync(email: string) : Promise<any> {
    const user: JwtPayload = {
      email: email,
      roles: ['Connectee']
    };

    return jwt.sign(user, Config.AUTH_SECRETKEY, { expiresIn: 3600 });
  }

  async loginAsync(email: string, password: string) {
    const user = await this.userService.validateUserAsync(email, password);

    if (!user)
      throw new HttpException("Can't validate user", HttpStatus.UNAUTHORIZED);

    const token: JwtPayload = {
      email: user.email,
      roles: ['Connectee']
    };

    return jwt.sign(token, Config.AUTH_SECRETKEY, { expiresIn: 3600 });
  }

  async validateUser(payload: JwtPayload): Promise<IUser> {
    return await this.userService.getUserByEmailAsync(payload.email);
  }
}
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from '../../userMgmt/services/user.service';
import { UserDto } from '../../userMgmt/models/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) { }

  async createToken() {
    const user: JwtPayload = {
      email: 'jens@connectedawareness.org'
    };

    return jwt.sign(user, 'ConnectedAwarenessIsCool', { expiresIn: 3600 });
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    return await this.userService.getUserByEmail(payload.email);
  }
}
import { JwtService } from '@nestjs/jwt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { IToken, IRolesInOrganisation } from '../../../../npm-interfaces/src/auth/token.interface';
import { IUser } from '../../../../npm-interfaces/src/userMgmt/user.interface';

import { TokenResponseDto } from '../models/dtos/tokenResponse.dto';
import { AuthRequestDto } from '../models/dtos/authRequest.dto';
import { UserService } from './user.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService) { }

  async loginAsync(authRequest: AuthRequestDto): Promise<TokenResponseDto> {
    const response = new TokenResponseDto();

    if (!authRequest) {
      response.message = "No login data supplied";
      throw new HttpException(response, HttpStatus.UNAUTHORIZED);
    }

    try {
      const user = await this.userService.validateUserAsync(authRequest.email, authRequest.password);

      if (!user) {
        response.message = "Can't validate user";
        throw new HttpException(response, HttpStatus.UNAUTHORIZED);
      }

      const payload: IToken = {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        capabilities: user.capabilities,
        rolesInOrganisations: new Array<IRolesInOrganisation>()
      };

      if (user.rolesInOrganisations && user.rolesInOrganisations.length)
        user.rolesInOrganisations.forEach(rio => {
          payload.rolesInOrganisations.push({
            userAlias: rio.userAlias,
            userRoles: rio.userRoles,
            organisationId: rio.organisation.organisationId
          } as IRolesInOrganisation);
        }
        );

      response.token = this.jwtService.sign(payload);
      //response.token = jwt.sign(payload, Config.AUTH_SECRETKEY, { expiresIn: 3600 });

    } catch (err) {
      response.message = "Error validating User";
    }

    return response;
  }

  async validateUser(payload: IToken): Promise<IUser> {
    return await this.userService.getUserByEmailAsync(payload.email);
  }
}
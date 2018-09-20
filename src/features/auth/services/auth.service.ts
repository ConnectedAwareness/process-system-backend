import * as jwt from 'jsonwebtoken';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IJwtPayload, IRolesInOrganisation } from '../interfaces/jwt-payload.interface';
import { UserService } from '../../userMgmt/services/user.service';
import { Config } from '../../../environments/environments';
import { IUser } from '../../../../npm-interfaces/src/userMgmt/user.interface';
import { TokenResponseDto } from '../models/tokenResponse.dto';
import { AuthRequestDto } from '../models/authRequest.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) { }

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

      const payload: IJwtPayload = {
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
            userRoles: rio.roles,
            organisationName: rio.organisation.name
          } as IRolesInOrganisation);
        }
        );

      response.token = jwt.sign(payload, Config.AUTH_SECRETKEY, { expiresIn: 3600 });

    } catch (err) {
      response.message = "Error validating User";
    }

    return response;
  }

  async validateUser(payload: IJwtPayload): Promise<IUser> {
    return await this.userService.getUserByEmailAsync(payload.email);
  }
}
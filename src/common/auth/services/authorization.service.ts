import { Injectable } from '@nestjs/common';
import { IToken } from '../../../../npm-interfaces/src/auth/token.interface';

@Injectable()
export class AuthorizationService {
    public hasRoles(roles: string[], token: IToken) {
        return roles.some(r => this.hasRole(r, token));
    }

    public hasRole(role: string, token: IToken): boolean {
        if (!token.rolesInOrganisations || token.rolesInOrganisations.length === 0)
            return null;

        token.rolesInOrganisations.forEach(rio => {
            if (rio.userRoles.some(r => r === role))
                return true;
        }
        );
    }

    public hasCapabilities(capabilities: string[], token: IToken) {
        return capabilities.some(cap => this.hasCapability(cap, token));
    }

    public hasCapability(capability: string, token: IToken): boolean {
        return token.capabilities.some(cap => cap === capability);
    }

    // async validateUser(payload: IToken): Promise<IUser> {
    //     return await this.userService.getUserByEmailAsync(payload.email);
    // }
}

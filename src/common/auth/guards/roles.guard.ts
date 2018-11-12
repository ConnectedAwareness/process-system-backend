import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthorizationService } from '../services/authorization.service';
import { IToken } from '../../../../npm-interfaces/src/auth/token.interface';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly service: AuthorizationService,
        private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext) {
        try {
            const roles = this.reflector.get<string[]>('roles', context.getHandler());
            const capabilities = this.reflector.get<string[]>('capabilities', context.getHandler());

            if (!roles && !capabilities) {
                return true;
            }

            const request = context.switchToHttp().getRequest();
            const authHeader = request.headers.authorization as string;

            if (!authHeader) {
                console.error('Could not find Authorization header on request. Abort RolesGuard!');
                throw new HttpException("No Authorization header set", HttpStatus.UNAUTHORIZED);
            }

            const token = authHeader.slice(authHeader.indexOf(' ') + 1);

            const jwtPayload = this.jwtService.verify(token) as IToken;

            return this.service.hasRoles(roles, jwtPayload) || this.service.hasCapabilities(capabilities, jwtPayload);
        }
        catch (err) {
            console.log("Error executing RolesGuard", err);
            throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
        }
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}

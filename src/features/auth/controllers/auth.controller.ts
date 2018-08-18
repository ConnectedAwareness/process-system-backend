import { Controller, Get, UseGuards, Param, Body, Post } from '@nestjs/common';
import { ApiOperation, ApiImplicitParam, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../services/auth.service';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('token/:email')
  @ApiOperation({ title: 'get token by email' })
  @ApiImplicitParam({ name: 'email', required: true, description: 'email of user' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  async createTokenAsync(@Param('email') email: string): Promise<any> {
    return await this.authService.createTokenAsync(email);
  }

  // we got no reason to Post, do we?
  @Get('login/:email/:password')
  @ApiOperation({ title: 'login' })
  // NOTE OpenAPI "in:" parameter type is one of (path, query, header, cookie), see https://swagger.io/docs/specification/describing-parameters/
  // nestjs/swagger sets OpenAPI "in:" parameter type dependent on which ApiImplicit* we choose; @ApiImplicitParam gets "in:path"
  // see https://github.com/nestjs/swagger/blob/master/lib/decorators/api-implicit-param.decorator.ts
  // additionally, "Implicit" seems not to be expressive enough, they have to be made explicit in @Get/@Post annotation
  @ApiImplicitParam({ name: 'email', required: true, description: 'email of user' })
  @ApiImplicitParam({ name: 'password', required: true, description: 'password of user' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  async loginAsync(@Param('email') email: string, @Param('password') password: string): Promise<any> {
    // console.log("Got login request with email " + email);
    return await this.authService.loginAsync(email, password);
  }

  @Get('data')
  @UseGuards(AuthGuard('jwt'))
  findAll() {
      return "Hello World, you are authenticated!";
  }
}
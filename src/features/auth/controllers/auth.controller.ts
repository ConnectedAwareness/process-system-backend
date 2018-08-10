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

  @Post('login')
  @ApiOperation({ title: 'login' })
  @ApiImplicitParam({ name: 'email', required: true, description: 'email of user' })
  @ApiImplicitParam({ name: 'password', required: true, description: 'password of user' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  async loginAsync(@Param('email') email: string, @Param('email') password: string): Promise<any> {
    return await this.authService.loginAsync(email, password);
  }

  @Get('data')
  @UseGuards(AuthGuard('jwt'))
  findAll() {
      return "Hello World, you are authenticated!";
  }
}
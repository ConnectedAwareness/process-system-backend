import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { ApiOperation, ApiImplicitParam, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('token/:email')
  @ApiOperation({ title: 'get token by email' })
  @ApiImplicitParam({ name: 'email', required: true, description: 'email of user' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  async createToken(@Param('email') email: string): Promise<any> {
    return await this.authService.createToken(email);
  }

  @Get('data')
  @UseGuards(AuthGuard('jwt'))
  findAll() {
      return "Hello World, you are authenticated!";
  }
}
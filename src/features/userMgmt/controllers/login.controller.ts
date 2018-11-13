import { Controller, Get, UseGuards, Param, Body, Post } from '@nestjs/common';
import { ApiOperation, ApiImplicitParam, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { LoginService } from '../services/login.service';
import { TokenResponseDto } from '../models/dtos/tokenResponse.dto';
import { AuthRequestDto } from '../models/dtos/authRequest.dto';

@ApiUseTags('auth')
@Controller('auth')
export class LoginController {
  constructor(private readonly authService: LoginService) {}

  @Post('login')
  @ApiOperation({ title: 'login' })
  // NOTE OpenAPI "in:" parameter type is one of (path, query, header, cookie), see https://swagger.io/docs/specification/describing-parameters/
  // nestjs/swagger sets OpenAPI "in:" parameter type dependent on which ApiImplicit* we choose; @ApiImplicitParam gets "in:path"
  // see https://github.com/nestjs/swagger/blob/master/lib/decorators/api-implicit-param.decorator.ts
  // additionally, "Implicit" seems not to be expressive enough, they have to be made explicit in @Get/@Post annotation
  @ApiResponse({ status: 200, description: 'Login successful' })
  async loginAsync(@Body() authRequest: AuthRequestDto): Promise<TokenResponseDto> {
    return await this.authService.loginAsync(authRequest);
  }

  @Get('data')
  @UseGuards(AuthGuard())
  findAll() {
      return "Hello World, you are authenticated!";
  }
}
import { Controller, Get, Post, Body, Param, Put, Delete, Patch, HttpCode, Query, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery, ApiImplicitBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from '../services/user.service';
import { UserDto } from '../models/dtos/user.dto';
import { IUser } from '../models/interfaces/user.interface';

@ApiUseTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Get(':userId')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'get user by Id' })
  @ApiImplicitParam({ name: 'userId', required: true, description: 'userId of user' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  async getUserById(@Param('userId') userId: string): Promise<IUser> {
    return await this.userService.getUserByIdAsync(userId);
  }

  @Get('byemail/:email')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'get user by email' })
  @ApiImplicitParam({ name: 'email', required: true, description: 'email of user' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  async getUserByEmail(@Param('email') email: string): Promise<IUser> {
    return await this.userService.getUserByEmailAsync(email);
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'create an user' })
  @ApiImplicitBody({ name: 'user', required: true, description: 'The user to create', type: UserDto })
  @ApiResponse({ status: 201, description: 'Create user successful' })
  async createUser(@Body('user') user: IUser): Promise<IUser> {
    return await this.userService.createUserAsync(user);
  }

  @Put()
  @Put(':userId')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'update an user' })
  @ApiImplicitBody({ name: 'user', required: true, description: 'The user to update', type: UserDto })
  @ApiResponse({ status: 200, description: 'Update successful', type: UserDto, isArray: false })
  async updateUser(@Param('userId') userId: string, @Body('user') user: IUser): Promise<IUser> {
    return await this.userService.updateUserAsync(userId, user);
  }

  @Delete(':userId')
  // @UseGuards(AuthGuard('jwt'))
  @HttpCode(202)
  @ApiOperation({ title: 'delete an user' })
  @ApiImplicitParam({ name: 'userId', required: true, description: 'Id of the user to delete' })
  @ApiResponse({ status: 202, description: 'Delete successful' })
  async deleteUser(@Param('userId') userId: string): Promise<boolean> {
    return await this.userService.deleteUserAsync(userId);
  }
}

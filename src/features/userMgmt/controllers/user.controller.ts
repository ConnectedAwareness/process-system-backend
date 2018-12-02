import { Controller, Get, Post, Body, Param, Put, Delete, Patch, HttpCode, Query, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from '../services/user.service';
import { UserDto } from '../models/dtos/user.dto';
import { IUser } from '../../../../npm-interfaces/src/userMgmt/user.interface';
import { ResetPasswordDto } from '../models/dtos/resetpasswort.dto';
import { RolesGuard } from '../../../common/auth/guards/roles.guard';
import { Roles } from '../../../common/auth/guards/roles.decorator';
import { Capabilities } from '../../../common/auth/guards/capabilities.decorator';

@ApiUseTags('users')
@Controller('users')
@UseGuards(AuthGuard())
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  @Roles('ProcessCoordinator', 'Connector')
  @Capabilities('ITAdmin', 'AwarenessIntegrator')
  @ApiOperation({ title: 'get all users' })
  @ApiImplicitQuery({ name: 'skip', required: false})
  @ApiImplicitQuery({ name: 'limit', required: false})
  @ApiResponse({ status: 200, description: 'Get All successful' })
  async getAllUsers(@Query('skip') skip?: string, @Query('limit') limit?: number) : Promise<IUser[]> {
    return await this.userService.getAllUsersAsync();
  }

  @Get(':userId')
  @Roles('Connectee', 'Connector')
  @Capabilities('ITAdmin', 'AwarenessIntegrator')
  @ApiOperation({ title: 'get user by Id' })
  @ApiImplicitParam({ name: 'userId', required: true, description: 'userId of user' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  async getUserById(@Param('userId') userId: string): Promise<IUser> {
    return await this.userService.getUserByIdAsync(userId);
  }

  // TODO needed?
  @Get('byemail/:email')
  @Roles('Connectee', 'Connector')
  @Capabilities('ITAdmin', 'AwarenessIntegrator')
  @ApiOperation({ title: 'get user by email' })
  @ApiImplicitParam({ name: 'email', required: true, description: 'email of user' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  async getUserByEmail(@Param('email') email: string): Promise<IUser> {
    return await this.userService.getUserByEmailAsync(email);
  }

  @Post()
  @HttpCode(201)
  @Roles('ProcessCoordinator', 'Connector')
  @Capabilities('ITAdmin', 'Connector')
  @ApiOperation({ title: 'create an user' })
  @ApiResponse({ status: 201, description: 'Create user successful', type: UserDto })
  async createUser(@Body() user: UserDto): Promise<IUser> {
    return await this.userService.createUserAsync(user);
  }

  @Put(':userId')
  @Roles('ProcessCoordinator', 'Connector')
  @Capabilities('ITAdmin', 'Connector')
  @ApiOperation({ title: 'update an user' })
  @ApiResponse({ status: 200, description: 'Update successful', type: UserDto, isArray: false })
  async updateUser(@Param('userId') userId: string, @Body() user: UserDto): Promise<IUser> {
    return await this.userService.updateUserAsync(userId, user);
  }

  @Delete(':userId')
  @HttpCode(202)
  @Roles('ProcessCoordinator')
  @Capabilities('ITAdmin', 'Connector')
  @ApiOperation({ title: 'delete an user' })
  @ApiImplicitParam({ name: 'userId', required: true, description: 'Id of the user to delete' })
  @ApiResponse({ status: 202, description: 'Delete successful' })
  async deleteUser(@Param('userId') userId: string): Promise<boolean> {
    return await this.userService.deleteUserAsync(userId);
  }

  @Post('resetpassword')
  @Roles('ProcessCoordinator')
  @Capabilities('ITAdmin', 'Connector')
  @ApiOperation({ title: 'reset an user\'s password' })
  @ApiResponse({ status: 200, description: 'Reset password successful' })
  async resetUserPassword(@Body() resetPassword: ResetPasswordDto): Promise<boolean> {
    return await this.userService.resetUserPasswordAsync(resetPassword);
  }
}

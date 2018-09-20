import { Controller, Get, Post, Body, Param, Put, Delete, Patch, HttpCode, Query, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery, ApiImplicitBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { RoleService } from '../services/role.service';
import { UserInOrganisationDto } from '../models/dtos/userinorganisation.dto';
import { IUserInOrganisation } from '../../../../npm-interfaces/src/userMgmt/userinorganisation.interface';

@ApiUseTags('roles')
@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) { }

  @Post('add')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Add an user to an organisation' })
  // @ApiImplicitBody({ name: 'userInorganisation', required: true, description: 'transfer object', type: UserInOrganisationDto })
  @ApiResponse({ status: 200, description: 'Add user to organisation successful' })
  async addUserToOrganisationAsync(@Body() userInOrganisation: UserInOrganisationDto) : Promise<IUserInOrganisation> {
      return await this.roleService.addUserToOrganisationAsync(userInOrganisation);
  }

  @Put('update')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Update an user in an organisation' })
  @ApiResponse({ status: 200, description: 'Update role successful' })
  async updateUserInOrganisationAsync(@Body() userInOrganisation: UserInOrganisationDto) : Promise<IUserInOrganisation> {
      return await this.roleService.updateUserInOrganisationAsync(userInOrganisation);
  }

  @Delete('remove/organisation/:organisationId/user/:userId')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Remove an user from an organisation' })
  @ApiImplicitParam({ name: 'organisationId', required: true, description: 'organisationId of organisation' })
  @ApiImplicitParam({ name: 'userId', required: true, description: 'userId of user' })
  @ApiResponse({ status: 200, description: 'Delete role successful' })
  async removeUserFromOrganisationAsync(@Param('organisationId') organisationId: string, @Param('userId') userId: string) : Promise<boolean> {
      return await this.roleService.removeUserFromOrganisationAsync(organisationId, userId);
  }
}

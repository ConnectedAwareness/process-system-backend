import { Controller, Get, Post, Body, Param, Put, Delete, Patch, HttpCode, Query, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { RoleService } from '../services/role.service';
import { RoleDto } from '../models/dtos/role.dto';
import { IRole } from '../../../../npm-interfaces/src/userMgmt/role.interface';
import { RolesGuard } from '../../../common/auth/guards/roles.guard';
import { Roles } from '../../../common/auth/guards/roles.decorator';
import { Capabilities } from '../../../common/auth/guards/capabilities.decorator';

@ApiUseTags('roles')
@Controller('roles')
@UseGuards(AuthGuard())
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class RoleController {
  constructor(private roleService: RoleService) { }

  @Post('add')
  @Roles('ProcessCoordinator', 'Connector')
  @Capabilities('ITAdmin', 'Connector')
  @ApiOperation({ title: 'Add an user to an organisation' })
  @ApiResponse({ status: 200, description: 'Add user to organisation successful' })
  async addUserToOrganisationAsync(@Body() role: RoleDto) : Promise<IRole> {
      return await this.roleService.addUserToOrganisationAsync(role);
  }

  @Put('update')
  @Roles('ProcessCoordinator', 'Connector')
  @Capabilities('ITAdmin', 'Connector')
  @ApiOperation({ title: 'Update an user in an organisation' })
  @ApiResponse({ status: 200, description: 'Update role successful' })
  async updateRoleAsync(@Body() role: RoleDto) : Promise<IRole> {
      return await this.roleService.updateRoleAsync(role);
  }

  @Delete('remove/organisation/:organisationId/user/:userId')
  @Roles('ProcessCoordinator', 'Connector')
  @Capabilities('ITAdmin', 'Connector')
  @ApiOperation({ title: 'Remove an user from an organisation' })
  @ApiImplicitParam({ name: 'organisationId', required: true, description: 'organisationId of organisation' })
  @ApiImplicitParam({ name: 'userId', required: true, description: 'userId of user' })
  @ApiResponse({ status: 200, description: 'Delete role successful' })
  async removeUserFromOrganisationAsync(@Param('organisationId') organisationId: string, @Param('userId') userId: string) : Promise<boolean> {
      return await this.roleService.removeUserFromOrganisationAsync(organisationId, userId);
  }
}

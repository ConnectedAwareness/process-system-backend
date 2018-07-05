import { Controller, Get, Post, Body, Param, Put, Delete, Patch, HttpCode, Query, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery, ApiImplicitBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { OrganisationService } from '../services/organisation.service';
import { OrganisationDto } from '../models/dtos/organisation.dto';
import { UserDto } from '../models/dtos/user.dto';

@ApiUseTags('organisation')
@Controller('organisation')
export class OrganisationController {
  constructor(private organisationService: OrganisationService) {}

  @Get()
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'get all organisations' })
  @ApiResponse({ status: 200, description: 'Get All successful' })
  async getAllOrganisations(@Query('skip') skip: string, @Query('limit') limit: number) : Promise<OrganisationDto[]> {
    return await this.organisationService.getAllOrganisationsAsync();
  }

  @Get(':organisationId')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'get organisation by Id' })
  @ApiImplicitParam({ name: 'organisationId', required: true, description: 'organisationId of organisation' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  async getOrganisationById(@Param('organisationId') organisationId: string) : Promise<OrganisationDto> {
    return await this.organisationService.getOrganisationByIdAsync(organisationId);
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'create an organisation' })
  @ApiResponse({ status: 201, description: 'Create organisation successful' })
  async createOrganisation(@Body() organisation: OrganisationDto) : Promise<OrganisationDto> {
      return await this.organisationService.createOrganisationAsync(organisation);
  }

  @Put()
  @Put(':organisationId')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'update an organisation' })
  @ApiImplicitBody({ name: 'organisation', required: true, description: 'The organisation to update', type: OrganisationDto })
  @ApiResponse({ status: 200, description: 'Update successful', type: OrganisationDto, isArray: false })
  async updateOrganisation(@Param('organisationId') organisationId: string, @Body() organisation: OrganisationDto) : Promise<boolean> {
    return await this.organisationService.updateOrganisationAsync(organisation);
  }

  @Delete(':organisationId')
  // @UseGuards(AuthGuard('jwt'))
  @HttpCode(202)
  @ApiOperation({ title: 'delete an organisation' })
  @ApiImplicitParam({ name: 'organisationId', required: true, description: 'Id of the organisation to delete' })
  @ApiResponse({ status: 202, description: 'Delete successful' })
  async deleteOrganisation(@Param('organisationId') organisationId: string) : Promise<boolean> {
    return await this.organisationService.deleteOrganisationAsync(organisationId);
  }

  @Post(':organisationId/user')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Add an user to an organisation' })
  @ApiImplicitParam({ name: 'organisationId', required: true, description: 'Id of the organisation' })
  @ApiResponse({ status: 200, description: 'Create user successful' })
  async addUserToOrganisationAsync(@Param('organisationId') organisationId: string, @Body() user: UserDto) : Promise<UserDto> {
      return await this.organisationService.addOrUpdateUserToOrganisationAsync(organisationId, user);
  }

  @Delete(':organisationId/user/:userId')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Remove an user from an organisation' })
  @ApiImplicitParam({ name: 'organisationId', required: true, description: 'Id of the organisation' })
  @ApiImplicitParam({ name: 'userId', required: true, description: 'Id of the user' })
  @ApiResponse({ status: 200, description: 'Create user successful' })
  async removeUserFromOrganisationAsync(@Param('organisationId') organisationId: string, @Param('userId') userId: string) : Promise<boolean> {
      return await this.organisationService.removeUserFromOrganisationAsync(organisationId, userId);
  }

  @Put(':organisationId/user/:userId')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Add an user to an organisation' })
  @ApiImplicitParam({ name: 'organisationId', required: true, description: 'Id of the organisation' })
  @ApiImplicitParam({ name: 'userId', required: true, description: 'Id of the user' })
  @ApiResponse({ status: 200, description: 'Create user successful' })@ApiResponse({ status: 200, description: 'Create user successful' })
  async updateUserFromOrganisationAsync(@Param('organisationId') organisationId: string, @Param('userId') userId: string, @Body() user: UserDto) : Promise<UserDto> {
    return await this.organisationService.addOrUpdateUserToOrganisationAsync(userId, user);
  }
}

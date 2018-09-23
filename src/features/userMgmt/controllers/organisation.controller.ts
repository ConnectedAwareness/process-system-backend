import { Controller, Get, Post, Body, Param, Put, Delete, Patch, HttpCode, Query, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { OrganisationService } from '../services/organisation.service';
import { OrganisationDto } from '../models/dtos/organisation.dto';
import { IOrganisation } from '../../../../npm-interfaces/src/userMgmt/organisation.interface';

@ApiUseTags('organisations')
@Controller('organisations')
export class OrganisationController {
  constructor(private organisationService: OrganisationService) {}

  @Get()
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'get all organisations' })
  @ApiImplicitQuery({ name: 'skip', required: false})
  @ApiImplicitQuery({ name: 'limit', required: false})
  @ApiResponse({ status: 200, description: 'Get All successful' })
  async getAllOrganisations(@Query('skip') skip?: string, @Query('limit') limit?: number) : Promise<IOrganisation[]> {
    return await this.organisationService.getAllOrganisationsAsync();
  }

  @Get(':organisationId')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'get organisation by Id' })
  @ApiImplicitParam({ name: 'organisationId', required: true, description: 'organisationId of organisation' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  async getOrganisationById(@Param('organisationId') organisationId: string) : Promise<IOrganisation> {
    return await this.organisationService.getOrganisationByIdAsync(organisationId);
  }

  @Post('create')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'create an organisation' })
  @ApiResponse({ status: 201, description: 'Create organisation successful' })
  async createOrganisation(@Body() organisation: OrganisationDto) : Promise<IOrganisation> {
      return await this.organisationService.createOrganisationAsync(organisation);
  }

  @Put(':organisationId')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'update an organisation' })
  @ApiImplicitParam({ name: 'organisationId', required: true, description: 'Id of the organisation to delete' })
  @ApiResponse({ status: 200, description: 'Update successful', type: OrganisationDto, isArray: false })
  async updateOrganisation(@Param('organisationId') organisationId: string, @Body() organisation: OrganisationDto) : Promise<IOrganisation> {
    return await this.organisationService.updateOrganisationAsync(organisationId, organisation);
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
}

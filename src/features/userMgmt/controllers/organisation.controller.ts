import { Controller, Get, Post, Body, Param, Put, Delete, Patch, HttpCode } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery, ApiImplicitBody } from '@nestjs/swagger';

import { OrganisationService } from '../services/organisation.service';
import { OrganisationDto } from '../models/dtos/organisation.dto';

@ApiUseTags('organisation')
@Controller('organisation')
export class OrganisationController {
  constructor(private organisationService: OrganisationService) {}

  @Get()
  @ApiOperation({ title: 'get all organisations' })
  @ApiResponse({ status: 200, description: 'Get All successful' })
  async getAllOrganisations() : Promise<OrganisationDto[]> {
    return await this.organisationService.getAllOrganisationsAsync();
  }

  @Get(':organisationId')
  @ApiOperation({ title: 'get organisation by Id' })
  @ApiImplicitParam({ name: 'organisationId', required: true, description: 'id of organisation' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  async getOrganisationById(@Param('organisationId') organisationId: string) : Promise<OrganisationDto> {
    return await this.organisationService.getOrganisationByIdAsync(organisationId);
  }

  @Post()
  @ApiOperation({ title: 'create an organisation' })
  @ApiResponse({ status: 201, description: 'Get All successful' })
  async createOrganisation(@Body() organisation: OrganisationDto) : Promise<OrganisationDto> {
      return await this.organisationService.createOrganisationAsync(organisation);
  }

  @Put()
  @ApiOperation({ title: 'update an organisation' })
  @ApiImplicitBody({ name: 'organisation', required: true, description: 'The organisation to update', type: OrganisationDto })
  @ApiResponse({ status: 200, description: 'Update successful', type: OrganisationDto, isArray: false })
  async updateOrganisation(@Body() organisation: OrganisationDto) : Promise<boolean> {
    return await this.organisationService.updateOrganisationAsync(organisation);
  }

  @Delete(':organisationId')
  @HttpCode(202)
  @ApiOperation({ title: 'delete an organisation' })
  @ApiImplicitParam({ name: 'id', required: true, description: 'Id of the tenant to delete' })
  @ApiResponse({ status: 202, description: 'Delete successful' })
  async deleteOrganisation(@Param('organisationId') organisationId: string) : Promise<boolean> {
    return await this.organisationService.deleteOrganisationAsync(organisationId);
  }
}

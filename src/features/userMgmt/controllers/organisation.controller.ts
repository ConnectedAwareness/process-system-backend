import { Controller, Get, Post, Body, Param, Put, Delete, Patch, HttpCode, Query, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { OrganisationService } from '../services/organisation.service';
import { OrganisationDto } from '../models/dtos/organisation.dto';
import { IOrganisation } from '../../../../npm-interfaces/src/userMgmt/organisation.interface';
import { RolesGuard } from '../../../common/auth/guards/roles.guard';
import { Roles } from '../../../common/auth/guards/roles.decorator';
import { Capabilities } from '../../../common/auth/guards/capabilities.decorator';

@ApiUseTags('organisations')
@Controller('organisations')
@UseGuards(AuthGuard())
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class OrganisationController {
  constructor(private organisationService: OrganisationService) {}

  @Get()
  @Roles('Connector')
  @Capabilities('ITAdmin', 'Connector')
  @ApiOperation({ title: 'get all organisations' })
  @ApiImplicitQuery({ name: 'skip', required: false})
  @ApiImplicitQuery({ name: 'limit', required: false})
  @ApiResponse({ status: 200, description: 'Get All successful' })
  async getAllOrganisations(@Query('skip') skip?: string, @Query('limit') limit?: number) : Promise<IOrganisation[]> {
    return await this.organisationService.getAllOrganisationsAsync();
  }

  @Get(':organisationId')
  @ApiOperation({ title: 'get organisation by Id' })
  @ApiImplicitParam({ name: 'organisationId', required: true, description: 'organisationId of organisation' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  async getOrganisationById(@Param('organisationId') organisationId: string) : Promise<IOrganisation> {
    return await this.organisationService.getOrganisationByIdAsync(organisationId);
  }

  @Post()
  @Roles('Connector')
  @Capabilities('ITAdmin', 'Connector')
  @ApiOperation({ title: 'create an organisation' })
  @ApiResponse({ status: 201, description: 'Create organisation successful' })
  async createOrganisation(@Body() organisation: OrganisationDto) : Promise<IOrganisation> {
      return await this.organisationService.createOrganisationAsync(organisation);
  }

  @Put(':organisationId')
  @Roles('Connector')
  @Capabilities('ITAdmin', 'Connector')
  @ApiOperation({ title: 'update an organisation' })
  @ApiImplicitParam({ name: 'organisationId', required: true, description: 'Id of the organisation to delete' })
  @ApiResponse({ status: 200, description: 'Update successful', type: OrganisationDto, isArray: false })
  async updateOrganisation(@Param('organisationId') organisationId: string, @Body() organisation: OrganisationDto) : Promise<IOrganisation> {
    return await this.organisationService.updateOrganisationAsync(organisationId, organisation);
  }

  @Delete(':organisationId')
  @HttpCode(202)
  @Roles('Connector')
  @Capabilities('ITAdmin', 'Connector')
  @ApiOperation({ title: 'delete an organisation' })
  @ApiImplicitParam({ name: 'organisationId', required: true, description: 'Id of the organisation to delete' })
  @ApiResponse({ status: 202, description: 'Delete successful' })
  async deleteOrganisation(@Param('organisationId') organisationId: string) : Promise<boolean> {
    return await this.organisationService.deleteOrganisationAsync(organisationId);
  }
}

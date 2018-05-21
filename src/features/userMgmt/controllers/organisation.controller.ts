import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery, ApiImplicitBody } from '@nestjs/swagger';

import { OrganisationService } from '../services/organisation.service';
import { Organisation } from '../models/organisation.representation';

@ApiUseTags('organisation')
@Controller('organisation')
export class OrganisationController {
  constructor(private organisationService: OrganisationService) {}

  @Get()
  @ApiOperation({ title: 'get all organisations' })
  @ApiResponse({ status: 200, description: 'Get All successful' })
  async readAll() {
    return await this.organisationService.readAll();
  }

  @Get(':id')
  @ApiOperation({ title: 'get organisation by Id' })
  @ApiResponse({ status: 200, description: 'Get All successful' })
  async readOne(@Param() params) {
    return params.id;
  }

  @Post()
  @ApiOperation({ title: 'create an organisation' })
  @ApiResponse({ status: 201, description: 'Get All successful' })
  async create(@Body() organisation: Organisation) {
      await this.organisationService.createOne(organisation);
  }

  @Put(':id')
  @ApiOperation({ title: 'update Organisation' })
  @ApiResponse({ status: 200, description: 'Get All successful' })
  async updateOne(@Param() params) {
    return params.id;
  }

  @Delete(':id')
  @ApiOperation({ title: 'delete organisation' })
  @ApiResponse({ status: 200, description: 'Get All successful' })
  async deleteOne(@Param() params) {
    return params.id;
  }
}

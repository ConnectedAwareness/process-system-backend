import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { OrganisationService } from '../services/organisation.service';
import { IOrganisation } from '../models/organisation.representation';

@Controller('organisation')
export class OrganisationController {
  constructor(private organisationService: OrganisationService) {}
  @Post()
  async create(@Body() organisation: IOrganisation) {
      await this.organisationService.createOne(organisation);
  }
  @Get()
  async readAll() {
    return await this.organisationService.readAll();
  }
  @Get(':id')
  async readOne(@Param() params) {
    return params.id;
  }
  @Put(':id')
  async updateOne(@Param() params) {
    return params.id;
  }
  @Delete(':id')
  async deleteOne(@Param() params) {
    return params.id;
  }
}

import { Controller, Get, Post, Body, Param, Put, Patch, Delete, Query, HttpCode, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ElementService } from '../services/element.service';
import { IElement } from '../../../../npm-interfaces/src/processDoc/element.interface';
import { ElementDto } from '../models/dtos/element.dto';
import { RolesGuard } from '../../../common/auth/guards/roles.guard';
import { Capabilities } from '../../../common/auth/guards/capabilities.decorator';

@ApiUseTags('elements')
@Controller('elements')
@UseGuards(AuthGuard())
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class ElementController {
  constructor(private elementService: ElementService) {}

  @Get()
  @ApiOperation({ title: 'get all elements' })
  @ApiResponse({ status: 200, description: 'Get All successful', type: ElementDto, isArray: true })
  async getAllElements() : Promise<IElement[]> {
    return await this.elementService.getAllElementsAsync();
  }

  // CRUD

  @Get(':elementId')
  @ApiOperation({ title: 'get a specific element by id' })
  @ApiImplicitParam({ name: 'elementId', required: true, description: 'id of element' })
  @ApiResponse({ status: 200, description: 'Get successful', type: ElementDto })
  async getElement(@Param('elementId') elementId: string) : Promise<IElement> {
    return this.elementService.getElementAsync(elementId);
  }

  @Post()
  @Capabilities('ITAdmin', 'AwarenessIntegrator')
  @ApiOperation({ title: 'Create an element' })
  @ApiResponse({ status: 201, description: 'Creation successful', type: ElementDto })
  async createElement(@Body() element: ElementDto) : Promise<IElement> {
      console.log('Create element');
      return await this.elementService.createElementAsync(element);
  }

  // TODO do not use until we know why we should
  // we'd need more like "append element-version if changed, otherwise return old version"
  // @Put()
  // @ApiOperation({ title: 'update an element' })
  // @ApiResponse({ status: 200, description: 'Update successful', type: ElementDto, isArray: false })
  // async updateElement(@Body() element: ElementDto) : Promise<IElement> {
  //     return this.elementService.updateElementAsync(element);
  // }

}
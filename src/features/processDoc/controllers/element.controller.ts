import { Controller, Get, Post, Body, Param, Put, Patch, Delete, Query, HttpCode, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery, ApiImplicitBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ElementService } from '../services/element.service';
import { ElementDto } from '../models/dtos/element.dto';
import { IElement } from '../models/interfaces/element.interface';

@ApiUseTags('elements')
@Controller('elements')
export class ElementController {
  constructor(private elementService: ElementService) {}

  @Get()
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'get all elements' })
  @ApiResponse({ status: 200, description: 'Get All successful' })
  async getAllElements() : Promise<IElement[]> {
    return await this.elementService.getAllElementsAsync();
  }

  // CRUD

  @Get(':elementId')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'get a specific element by id' })
  @ApiImplicitParam({ name: 'elementId', required: true, description: 'id of element' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  async getElement(@Param('elementId') elementId: string) : Promise<IElement> {
    return this.elementService.getElementAsync(elementId);
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Create an element' })
  @ApiResponse({ status: 201, description: 'Creation successful' })
  async createElement(@Body() element: IElement) : Promise<IElement> {
      console.log('Create element');
      return await this.elementService.createElementAsync(element);
  }

  // TODO do not use until we know why we should
  // we'd need more like "append element-version if changed, otherwise return old version"
  // @Put()
  // // @UseGuards(AuthGuard('jwt'))
  // @ApiOperation({ title: 'update an element' })
  // @ApiImplicitBody({ name: 'element', required: true, description: 'The element to update', type: ElementDto })
  // @ApiResponse({ status: 200, description: 'Update successful', type: ElementDto, isArray: false })
  // async updateElement(@Body() element: IElement) : Promise<IElement> {
  //     return this.elementService.updateElementAsync(element);
  // }

}
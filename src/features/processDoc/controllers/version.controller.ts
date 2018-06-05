import { Controller, Get, Post, Body, Param, Put, Patch, Delete, Query, HttpCode } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery, ApiImplicitBody } from '@nestjs/swagger';

import { VersionService } from '../services/version.service';
import { VersionDto, ImportVersion } from '../dtos/version.dto';

@ApiUseTags('versions')
@Controller('versions')
export class VersionController {
  constructor(private versionService: VersionService) {}

  @Get()
  @ApiOperation({ title: 'get all versions' })
  @ApiResponse({ status: 200, description: 'Get All successful' })
  async getAllVersions() : Promise<VersionDto[]> {
    return new Array<VersionDto>();
  }

  // CRUD

  @Get(':versionid')
  @ApiOperation({ title: 'get a specific version by id' })
  @ApiImplicitParam({ name: 'versionid', required: true, description: 'id of version' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  async getVersion(@Param('versionid') versionId: string) : Promise<VersionDto> {
    return this.versionService.getVersionAsync(versionId);
  }

  @Post()
  @ApiOperation({ title: 'Create a version' })
  @ApiResponse({ status: 201, description: 'Creation successful' })
  async createVersion(@Body() version: VersionDto) : Promise<VersionDto> {
      console.log('Create version');
      return await this.versionService.createVersionAsync(version);
  }

  @Put()
  @ApiOperation({ title: 'update a version' })
  @ApiImplicitBody({ name: 'version', required: true, description: 'The version to update', type: VersionDto })
  @ApiResponse({ status: 200, description: 'Update successful', type: VersionDto, isArray: false })
  async updateVersion(@Body() version: VersionDto) : Promise<boolean> {
      return this.versionService.updateVersionAsync(version);
  }

  // END CRUD

  @Put('/import/:versionid')
  @ApiOperation({ title: 'import version from file' })
  @ApiImplicitParam({ name: 'versionid', required: true, description: 'id of version' })
  @ApiImplicitBody({ name: 'versionFile', required: true, description: 'version object', type: VersionDto })
  @ApiResponse({ status: 200, description: 'Import successful', type: VersionDto, isArray: false })
  async import(@Param('versionid') versionId: string, @Body('versionFile') versionFile: VersionDto) : Promise<boolean> {
    return true;
      // return this.versionService.importElementsRecursiveAsync(versionId, versionFile);
  }

//   @Post('/import/:versionid')
//   @ApiOperation({ title: 'import version from file' })
//   //@ApiImplicitParam({ name: 'versionid', required: true, description: 'id of version' })
//   //@ApiImplicitParam({ name: 'versionFile', required: true, type: String, description: 'version object' })
//   @ApiResponse({ status: 201, description: 'Import successful', type: VersionDto, isArray: false })
//   async import(@Body() versionFile: string) : Promise<boolean> {
//       return this.versionService.importElementsRecursiveAsync("v1.0", versionFile);
//   }
}
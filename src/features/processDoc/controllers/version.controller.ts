import { Controller, Get, Post, Body, Param, Put, Patch, Delete, Query, HttpCode, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery, ApiImplicitBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { VersionService } from '../services/version.service';
import { VersionDto } from '../models/dtos/version.dto';
import { IVersion } from '../models/interfaces/version.interface';
import { Config } from '../../../environments/environments';

@ApiUseTags('versions')
@Controller('versions')
export class VersionController {
  constructor(private versionService: VersionService) { }

  @Get('all/:depth?')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'get all versions' })
  @ApiImplicitParam({ name: 'depth', required: false, description: 'depth of version trees to fetch. missing value will fetch empty tree' })
  @ApiResponse({ status: 200, description: 'Get All successful' })
  async getAllVersions(@Param('depth') depth: string): Promise<IVersion[]> {
    const depthN = depth ? Number.parseInt(depth) : 0;
    return this.versionService.getAllVersionsAsync(depthN);
  }

  // CRUD

  @Get(':versionId/:depth?')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'get a specific version by id' })
  @ApiImplicitParam({ name: 'versionId', required: true, description: 'id of version' })
  @ApiImplicitParam({ name: 'depth', required: false, description: 'depth of version tree to fetch. missing value will fetch full tree' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  async getVersion(@Param('versionId') versionId: string, @Param('depth') depth: string): Promise<IVersion> {
    const depthN = depth ? Number.parseInt(depth) : Config.ASSUMED_MAXIMUM_VERSION_DEPTH;
    return this.versionService.getVersionAsync(versionId, depthN);
  }

  @Post('create')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Create a version' })
  @ApiImplicitBody({ name: 'version', required: true, description: 'The version to create', type: VersionDto })
  @ApiResponse({ status: 201, description: 'Creation successful' })
  async createVersion(@Body() version: IVersion): Promise<IVersion> {
    console.log('Create version');
    return await this.versionService.createVersionAsync(version);
  }

  // TODO do not use until we know why we should
  // are versions immutable?
  // we'd need more like "create new version as copy from old one"
  @Put(':versionId')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'update a version' })
  @ApiImplicitBody({ name: 'version', required: true, description: 'The version to update', type: VersionDto })
  @ApiResponse({ status: 200, description: 'Update successful', type: VersionDto, isArray: false })
  async updateVersion(@Body() version: IVersion): Promise<IVersion> {
    return this.versionService.updateVersionAsync(version);
  }

}
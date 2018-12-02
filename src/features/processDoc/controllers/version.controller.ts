import { Controller, Get, Post, Body, Param, Put, Patch, Delete, Query, HttpCode, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiBearerAuth, ApiImplicitQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { VersionService } from '../services/version.service';
import { VersionDto } from '../models/dtos/version.dto';
import { IVersion } from '../../../../npm-interfaces/src/processDoc/version.interface';
import { Config } from '../../../environments/environments';
import { RolesGuard } from '../../../common/auth/guards/roles.guard';
import { Roles } from '../../../common/auth/guards/roles.decorator';
import { Capabilities } from '../../../common/auth/guards/capabilities.decorator';
import { BooleanPipe, NumberPipe } from '../../../common/util/util';

@ApiUseTags('versions')
@Controller('versions')
@UseGuards(AuthGuard())
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class VersionController {
  constructor(private versionService: VersionService) { }

  @Get('all/:depth?')
  @Roles('ProcessCoordinator', 'Connector')
  @Capabilities('ITAdmin', 'Connector', 'AwarenessIntegrator')
  @ApiOperation({ title: 'get all versions' })
  @ApiImplicitQuery({ name: 'depth', required: false, description: 'depth of version trees to fetch. missing value will fetch empty tree' })
  @ApiImplicitQuery({ name: 'skip', required: false, description: 'number of elements to skip' })
  @ApiImplicitQuery({ name: 'limit', required: false, description: 'max number of elements to return' })
  @ApiResponse({ status: 200, description: 'Get All successful' })
  async getAllVersions(
    @Query('depth', new NumberPipe()) depth?: number,
    @Query('skip', new NumberPipe()) skip?: number,
    @Query('limit', new NumberPipe()) limit?: number): Promise<IVersion[]> {

    return this.versionService.getAllVersionsAsync(depth, skip, limit);
  }

  // CRUD

  @Get(':versionId/:depth?')
  @Roles('Connectee', 'Connector')
  @Capabilities('ITAdmin', 'Connector', 'AwarenessIntegrator')
  @ApiOperation({ title: 'get a specific version by id' })
  @ApiImplicitParam({ name: 'versionId', required: true, description: 'id of version' })
  @ApiImplicitQuery({ name: 'depth', required: false, description: 'depth of version tree to fetch. missing value will fetch full tree' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  async getVersion(@Param('versionId') versionId: string, @Param('depth') depth: string): Promise<IVersion> {
    // NOTE: I have no idea why swagger sets depth to "undefined" instead of leaving it unset, if it's kept empty in the form
    const depthN = depth && depth !== "undefined" ? Number.parseInt(depth) : Config.ASSUMED_MAXIMUM_VERSION_DEPTH;
    return this.versionService.getVersionDenormalizedAsync(versionId, depthN);
  }

  @Post('create')
  @Capabilities('ITAdmin', 'AwarenessIntegrator')
  @ApiOperation({ title: 'Create a version' })
  @ApiResponse({ status: 201, description: 'Creation successful' })
  async createVersion(@Body() version: VersionDto): Promise<IVersion> {
    console.log('Create version');
    return await this.versionService.createVersionAsync(version);
  }

  // TODO do not use until we know why we should
  // are versions immutable?
  // we'd need more like "create new version as copy from old one"
  @Put(':versionId')
  @Capabilities('ITAdmin', 'AwarenessIntegrator')
  @ApiOperation({ title: 'update a version' })
  @ApiResponse({ status: 200, description: 'Update successful', type: VersionDto })
  async updateVersion(@Param('versionId') versionId: string, @Body() version: VersionDto): Promise<IVersion> {
    return this.versionService.updateVersionAsync(versionId, version);
  }

  // TODO do not use until we know why we should
  // are versions immutable?
  // we'd need more like "create new version as copy from old one"
  @Put('publish/:versionId/:publish')
  @Capabilities('ITAdmin', 'AwarenessIntegrator')
  @ApiOperation({ title: 'update a version' })
  @ApiResponse({ status: 200, description: 'Update successful', type: Boolean })
  async publishVersion(@Param('versionId') versionId: string, @Param('publish', new BooleanPipe()) publish: boolean): Promise<boolean> {
    return this.versionService.publishVersionAsync(versionId, publish);
  }

}
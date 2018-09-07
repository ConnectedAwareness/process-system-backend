import { Controller, Get, Post, Body, Param, Put, Patch, Delete, Query, HttpCode, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery, ApiImplicitBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ImportService } from '../services/import.service';
import { VersionDto } from '../models/dtos/version.dto';
import { IVersion } from '../models/interfaces/version.interface';

@ApiUseTags('import')
@Controller('import')
export class ImportController {
  constructor(private importService: ImportService) {}

  @Put(':versionId/import')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'import version from file. Note: existing content will be replaced' })
  @ApiImplicitParam({ name: 'versionId', required: true, description: 'id of version' })
  @ApiResponse({ status: 200, description: 'Import successful', type: VersionDto, isArray: false })
  async import(@Param('versionId') versionId: string, @Body() versionFile: string) : Promise<IVersion> {
    return this.importService.importElementsRecursiveAsync(versionId, null);
  }

//   @Post('/import/:versionId')
//   @ApiOperation({ title: 'import version from file' })
//   //@ApiImplicitParam({ name: 'versionId', required: true, description: 'id of version' })
//   //@ApiImplicitParam({ name: 'versionFile', required: true, type: String, description: 'version object' })
//   @ApiResponse({ status: 201, description: 'Import successful', type: VersionDto, isArray: false })
//   async import(@Body() versionFile: string) : Promise<boolean> {
//       return this.importService.importElementsRecursiveAsync("v1.0", versionFile);
//   }
}
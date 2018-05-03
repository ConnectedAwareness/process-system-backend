import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { VersionService } from '../services/version.service';
import { IVersion } from '../models/version.representation';

@Controller('version')
export class VersionController {
  constructor(private versionService: VersionService) {}
  @Post()
  async importVersion(@Body() version: IVersion) {
      await this.versionService.importVersion(version);
  }
  @Get(':id')
  async getVersion(@Param() params) {
    await this.versionService.getVersion(params.id);
  }
}
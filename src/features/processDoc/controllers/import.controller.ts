import { Controller, Get, Post, Body, Param, Put, UploadedFile, UseInterceptors, FileInterceptor, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitFile, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as util from '../../../common/util/util';

import { ImportService } from '../services/import.service';
import { VersionDto } from '../models/dtos/version.dto';
import { IVersion } from '../../../../npm-interfaces/src/processDoc/version.interface';
import { RolesGuard } from '../../../common/auth/guards/roles.guard';
import { Capabilities } from '../../../common/auth/guards/capabilities.decorator';

@ApiUseTags('import')
@Controller('import')
@UseGuards(AuthGuard())
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class ImportController {
  constructor(private importService: ImportService) {}

  // file upload could work like that, but has to be tested by frontend code. Status "untested"
  // https://stackoverflow.com/questions/49096068/upload-file-using-nestjs-and-multer
  // file is saved in folder "./uploads/<uuid>_<filename>.csv"
  @Put(':versionId/upload')
  @Capabilities('ITAdmin', 'AwarenessIntegrator')
  @UseInterceptors(FileInterceptor('versionFile', {
      storage: diskStorage({
          destination: './uploads',
          filename: (req, versionFile, cb) => {
              const randomName = util.getId();
              const extension = extname(versionFile.originalname);
              const baseName = versionFile.originalname.split('.')[0];

              //Calling the callback passing the random name generated with the original extension name
              console.log(`${randomName}_${baseName}${extension}`);
              cb(null, `${randomName}_${baseName}${extension}`);
          }
      })
  }))
  @ApiOperation({ title: 'import version from file. Note: existing content will be replaced' })
  @ApiImplicitParam({ name: 'versionId', required: true, description: 'id of version' })
  @ApiResponse({ status: 200, description: 'Import successful', type: VersionDto, isArray: false })
  @ApiResponse({ status: 201, description: 'Upload and processing successful', type: VersionDto, isArray: false})
  @ApiResponse({ status: 404, description: 'Uploaded file missing'})
  @ApiResponse({ status: 500, description: 'Error processing uploaded file'})
  @ApiImplicitFile({ name: 'versionFile', required: true, description: 'version file' })
  async importWithFile(@Param('versionId') versionId: string, @UploadedFile() versionFile: any) : Promise<IVersion> {
    return this.importService.importElementsRecursiveAsync(versionId, versionFile.path);
  }
}
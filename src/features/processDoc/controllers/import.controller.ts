import { Controller, Get, Post, Body, Param, Put, UploadedFile, UseInterceptors, FileInterceptor } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery, ApiImplicitBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as util from '../../../common/util/util';

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

  // TODO: sadly no swagger file upload decorator exists so far, see: https://github.com/nestjs/swagger/pull/87
  // file upload could work like that, but has to be tested by frontend code. Status "untested"
  // https://stackoverflow.com/questions/49096068/upload-file-using-nestjs-and-multer
  // file is saved in folder "./uploads/<uuid>_<filename>.csv"
  @Put(':versionId/upload')
  @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
              const randomName = util.getId();
              const extension = extname(file.originalname);
              const baseName = file.originalname.split('.')[0];

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
  async importWithFile(@Param('versionId') versionId: string, @UploadedFile() versionFile: string) : Promise<IVersion> {
    return this.importService.importElementsRecursiveAsync(versionId, versionFile);
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
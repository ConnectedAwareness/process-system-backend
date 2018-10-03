import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';

import { ImportService } from '../../processDoc/services/import.service';
import { VersionService } from '../../processDoc/services/version.service';
import { IVersion } from '../../../../npm-interfaces/src/processDoc/version.interface';
import { ElementService } from '../../processDoc/services/element.service';

@Injectable()
export class VersionInitializationService {
    constructor(
        private versionService: VersionService,
        private elementService: ElementService,
        private importService: ImportService) { }

    async init(): Promise<void> {
        const importDataFlag = `${process.env.INITIALIZE_VERSION_DATA}` === 'true';

        //console.log('Starting to initialise DB');
        if (importDataFlag) {
            try {
                await this.elementService.deleteAllElementsAsync();
                await this.versionService.deleteAllVersionsAsync();

                const versionId = `${process.env.INITIALIZE_VERSION_DATA_ID}`;
                const v: IVersion = {
                    versionId: versionId,
                    published: false,
                    linkedNodeRoot: null,
                    nodes: []
                };
                await this.versionService.createVersionAsync(v);

                await this.importService.importElementsRecursiveAsync(
                    versionId,
                    `${process.env.INITIALIZE_VERSION_DATA_SRC}`
                );

                console.log("Import of version initialization data successful");
            } catch (e) {
                console.error(e);
            }
        }
    }
}

export const versionInitializationPovider = {
    provide: 'DbInitVersions',
    useFactory: async (versionInitializationService: VersionInitializationService) => {

        return await versionInitializationService.init();
    },
    inject: [VersionInitializationService],
};
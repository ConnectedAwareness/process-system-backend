import { Injectable,  Inject, HttpException, HttpStatus } from '@nestjs/common';

import { OrganisationService } from './organisation.service';

@Injectable()
export class InitialisationService {
    constructor(
        private organisationService: OrganisationService) { }

     async init() : Promise<void> {
        const importData = `${process.env.IMPORT_INITIAL_DATA}` === 'true';

        //console.log('Starting to initialise DB');
        if (importData) {
            await this.organisationService.importOrgsAndUserAsync();
        }
    }
}

export const initialisationPovider = {
    provide: 'DbInit',
    useFactory: async (initialisationService : InitialisationService) => {

      return await initialisationService.init();
    },
    inject: [InitialisationService],
  };
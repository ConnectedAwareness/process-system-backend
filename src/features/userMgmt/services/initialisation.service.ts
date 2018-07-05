import { Injectable,  Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';

import { OrganisationDto } from '../models/dtos/organisation.dto';
import { UserDto } from '../models/dtos/user.dto';
import { OrganisationSchema } from '../schemas/organisation.schema';
import { IOrganisation } from '../models/interfaces/organisation.interface';
import { IUser } from '../models/interfaces/user.interface';
import { UserService } from './user.service';
import { OrganisationFactory } from '../models/factories/organisation.factory';
import { UserFactory } from '../models/factories/user.factory';
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
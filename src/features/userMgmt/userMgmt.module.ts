import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseModule } from '../../main/database/database.module';

import { OrganisationController } from './controllers/organisation.controller';
import { OrganisationService } from './services/organisation.service';
import { organisationProviders } from './providers/organisation.providers';
import { UserService } from './services/user.service';
import { userProviders } from './providers/user.providers';
import { initialisationPovider, InitialisationService } from './services/initialisation.service';

@Module({
    imports: [DatabaseModule],
    controllers: [OrganisationController],
    providers: [OrganisationService, UserService, InitialisationService, ...organisationProviders, ...userProviders, initialisationPovider],
    exports: [OrganisationService, UserService]
})
export class UserMgmtModule {}
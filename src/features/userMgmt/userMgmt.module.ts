import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseModule } from '../../main/database/database.module';

import { OrganisationController } from './controllers/organisation.controller';
import { OrganisationService } from './services/organisation.service';
import { organisationProviders } from './database/providers/organisation.providers';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { userProviders } from './database/providers/user.providers';
import { initialisationPovider, InitialisationService } from './services/initialisation.service';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';
import { roleProviders } from './database/providers/role.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [OrganisationController, UserController, RoleController],
    providers: [OrganisationService, UserService, RoleService, InitialisationService,
                ...organisationProviders, ...userProviders, ...roleProviders, initialisationPovider],
    exports: [OrganisationService, UserService, RoleService]
})
export class UserMgmtModule {}
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseModule } from '../../main/database/database.module';

import { OrganisationController } from './controllers/organisation.controller';
import { OrganisationService } from './services/organisation.service';
import { organisationProviders } from './providers/organisation.providers';
import { UserService } from './services/user.service';
import { userProviders } from './providers/user.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [OrganisationController],
    providers: [OrganisationService, UserService, ...organisationProviders, ...userProviders],
    exports: [OrganisationService, UserService]
})
export class UserMgmtModule {}
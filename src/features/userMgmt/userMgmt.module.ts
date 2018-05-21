import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseModule } from '../../main/database/database.module';

import { OrganisationController } from './controllers/organisation.controller';
import { OrganisationService } from './services/organisation.service';
import { organisationProviders } from './providers/organisation.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [OrganisationController],
    providers: [OrganisationService, ...organisationProviders],
})
export class UserMgmtModule {}
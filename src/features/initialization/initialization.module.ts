import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { userInitializationPovider, UserInitializationService } from './services/userinitialization.service';
import { UserMgmtModule } from '../userMgmt/userMgmt.module';
import { VersionInitializationService, versionInitializationPovider } from './services/versioninitialization.service';
import { ProcessDocModule } from '../processDoc/processDoc.module';

@Module({
    imports: [UserMgmtModule, ProcessDocModule],
    providers: [UserInitializationService, userInitializationPovider,
        VersionInitializationService, versionInitializationPovider]
})
export class InitializationModule {}
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { userInitializationPovider, UserInitializationService } from './services/userinitialization.service';
import { UserMgmtModule } from '../userMgmt/userMgmt.module';

@Module({
    imports: [UserMgmtModule],
    providers: [UserInitializationService, userInitializationPovider]
})
export class InitializationModule {}
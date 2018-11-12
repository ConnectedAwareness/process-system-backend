import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InitializationModule } from './features/initialization/initialization.module';
import { UserMgmtModule } from './features/userMgmt/userMgmt.module';
import { ProcessDocModule } from './features/processDoc/processDoc.module';

@Module({
  imports: [InitializationModule, UserMgmtModule, ProcessDocModule],
})
export class AppModule {}

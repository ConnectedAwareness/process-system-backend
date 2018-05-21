import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserMgmtModule } from 'features/userMgmt/userMgmt.module';
import { ProcessDocModule } from 'features/processDoc/processDoc.module';

@Module({
  imports: [UserMgmtModule, ProcessDocModule],
})
export class AppModule {}

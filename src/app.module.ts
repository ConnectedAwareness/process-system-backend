import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Module,
  NestModule,
  MiddlewaresConsumer,
  RequestMethod,
  Get,
} from '@nestjs/common';
import { UserMgmtModule } from 'features/userMgmt/userMgmt.module';
// import { ProcessDocModule } from 'features/processDoc/processDoc.module';
@Module({
  imports: [],
  modules: [UserMgmtModule], // ProcessDocModule],
})
export class AppModule {}

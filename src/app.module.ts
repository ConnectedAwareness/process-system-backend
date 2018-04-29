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
@Module({
  imports: [],
  modules: [UserMgmtModule],
})
export class AppModule {}

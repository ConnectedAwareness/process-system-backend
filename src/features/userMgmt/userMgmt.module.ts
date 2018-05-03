import { Module } from '@nestjs/common';
import { OrganisationSchema } from './models/organisation.representation';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganisationController } from './controllers/organisation.controller';
import { OrganisationService } from './services/organisation.service';

@Module({
    imports: [MongooseModule.forRoot('mongodb://localhost/connected'),
    MongooseModule.forFeature([{ name: 'Organisation', schema: OrganisationSchema }])],
    controllers: [OrganisationController],
    components: [OrganisationService],
})
export class UserMgmtModule {}
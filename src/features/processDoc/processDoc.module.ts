import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VersionController } from './controllers/version.controller';
import { VersionService } from './services/version.service';
import { VersionSchema } from './models/version.representation';

@Module({
    imports: [MongooseModule.forRoot('mongodb://localhost/connected'),
    MongooseModule.forFeature([{ name: 'Version', schema: VersionSchema }])],
    controllers: [VersionController],
    components: [VersionService],
})
export class ProcessDocModule {}
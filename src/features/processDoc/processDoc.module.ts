import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseModule } from '../../main/database/database.module';

import { VersionController } from './controllers/version.controller';
import { VersionService } from './services/version.service';
import { versionProviders } from './database/providers/version.providers';
import { elementProviders } from './database/providers/element.providers';
import { orgProviders } from './database/providers/org.providers';
import { commentProviders } from './database/providers/comment.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [VersionController],
    providers: [VersionService, ...versionProviders, ...elementProviders, ...orgProviders, ...commentProviders],
})
export class ProcessDocModule {}
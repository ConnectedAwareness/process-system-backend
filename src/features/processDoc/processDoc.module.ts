import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseModule } from '../../common/database/database.module';

import { VersionController } from './controllers/version.controller';
import { VersionService } from './services/version.service';
import { versionProviders } from './database/providers/version.providers';
import { elementProviders } from './database/providers/element.providers';
import { elementVersionProviders } from './database/providers/elementversion.providers';
import { ImportController } from './controllers/import.controller';
import { ElementService } from './services/element.service';
import { ImportService } from './services/import.service';
import { ElementController } from './controllers/element.controller';
import { nodeProviders } from './database/providers/node.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [VersionController, ElementController, ImportController],
    providers: [ImportService, VersionService, ElementService,
        ...versionProviders, ...nodeProviders, ...elementProviders, ...elementVersionProviders],
    exports: [VersionService, ElementService, ImportService]
})
export class ProcessDocModule {}
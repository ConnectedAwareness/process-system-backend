import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../common/database/database.module';
import { AuthModule } from '../../common/auth/auth.module';

import { OrganisationController } from './controllers/organisation.controller';
import { OrganisationService } from './services/organisation.service';
import { organisationProviders } from './database/providers/organisation.providers';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { userProviders } from './database/providers/user.providers';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';
import { roleProviders } from './database/providers/role.providers';
import { LoginController } from './controllers/login.controller';
import { LoginService } from './services/login.service';

@Module({
    imports: [AuthModule, DatabaseModule],
    controllers: [LoginController, OrganisationController, UserController, RoleController],
    providers: [LoginService, OrganisationService, UserService, RoleService,
                ...organisationProviders, ...userProviders, ...roleProviders],
    exports: [OrganisationService, UserService, RoleService]
})
export class UserMgmtModule {}
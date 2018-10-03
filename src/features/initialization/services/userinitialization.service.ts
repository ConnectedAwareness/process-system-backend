import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';

import * as fs from 'fs';

import { OrganisationService } from '../../userMgmt/services/organisation.service';
import { UserService } from '../../userMgmt/services/user.service';
import { UserRole, UserCapability } from '../../../../npm-interfaces/src/userMgmt/user.interface';
import { ImportData } from '../../userMgmt/models/dtos/importdata.dto';
import { OrganisationDto } from '../../userMgmt/models/dtos/organisation.dto';
import { UserDto } from '../../userMgmt/models/dtos/user.dto';
import { RoleDto } from '../../userMgmt/models/dtos/role.dto';
import { RoleService } from '../../userMgmt/services/role.service';
import { ResetPasswordDto } from '../../userMgmt/models/dtos/resetpasswort.dto';

@Injectable()
export class UserInitializationService {
    constructor(
        private userService: UserService,
        private organisationService: OrganisationService,
        private roleService: RoleService) { }

    /**
     * User+Organisation data is expected to be as follows:
     * - no object has an UUID (*Id property)
     * - Organisation does not specify rolesOfUsers
     * - Users may leave capabilities and rolesInOrganisations blank
     * - organisation of User.rolesInOrganisation is identified by name
     */
    async init(): Promise<void> {
        const importDataFlag = `${process.env.INITIALIZE_USER_DATA}` === 'true';

        //console.log('Starting to initialise DB');
        if (importDataFlag) {
            try {
                const importDataJson = fs.readFileSync(`${process.env.INITIALIZE_USER_DATA_SRC}`);
                const importData = JSON.parse(importDataJson.toString()) as ImportData;

                await this.loadUserAndOrganisationData(importData);

                console.log("Import of user initialization data successful");
            } catch (e) {
                console.error(e);
            }
        }
    }

    async loadUserAndOrganisationData(data: ImportData) {

        await this.roleService.deleteAllRolesAsync();
        await this.userService.deleteAllUsersAsync();
        await this.organisationService.deleteAllOrganisationsAsync();

        // first, store organisations
        const organisations = Array<OrganisationDto>(); // to easily get org-id by name
        for (const io of data.organisations) {
            const o: OrganisationDto = {
                organisationId: null,
                name: io.name,
                version: null,
                users: []
            };
            const os = await this.organisationService.createOrganisationAsync(o);
            organisations.push(os); // store organisation for later use
        }

        // second, store users
        for (const iu of data.users) {
            const u: UserDto = {
                userId: null,
                email: iu.email,
                firstName: iu.firstName,
                lastName: iu.lastName,
                capabilities: iu.capabilities ? iu.capabilities.map(c => UserCapability[c]) : null,
                rolesInOrganisations: []
            };
            const us = await this.userService.createUserAsync(u);

            // third, set user password
            const rp: ResetPasswordDto = {
                userId: us.userId,
                oldPassword: null,
                newPassword: iu.password
            };
            await this.userService.resetUserPasswordAsync(rp);

            // fourth, add user to organisation
            if (iu.rolesInOrganisations)
                for (const r of iu.rolesInOrganisations) {
                    const org = organisations.find(o => o.name === r.organisationName);
                    const roles = r.roles.map(rs => UserRole[rs]);
                    const uio = { // NOTE no constructor, since some fields stay (purposefully) undefined
                        organisation: org,
                        organisationIsObject: true,
                        user: us,
                        userIsObject: true,
                        userAlias: r.alias,
                        userRoles: roles
                    } as RoleDto;
                    await this.roleService.addUserToOrganisationAsync(uio);
                }
        }
    }
}

export const userInitializationPovider = {
    provide: 'DbInitUsers',
    useFactory: async (userInitializationService: UserInitializationService) => {

        return await userInitializationService.init();
    },
    inject: [UserInitializationService],
};
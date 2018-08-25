import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';

import * as fs from 'fs';

import { OrganisationService } from './organisation.service';
import { UserService } from './user.service';
import { UserRole, IUser, UserCapability } from '../models/interfaces/user.interface';
import { Model } from 'mongoose';
import { IOrganisationSchema } from '../database/interfaces/organisation.schema.interface';
import { IUserSchema } from '../database/interfaces/user.schema.interface';
import { IOrganisation } from '../models/interfaces/organisation.interface';
import { ImportData } from '../models/dtos/importdata.dto';
import { OrganisationDto } from '../models/dtos/organisation.dto';
import { UserDto } from '../models/dtos/user.dto';
import { UserInOrganisationDto } from '../models/dtos/userinorganisation.dto';

class ImportedUserData {
    constructor() {
        this.organisations = new Array<IOrganisation>();
        this.users = new Array<IUser>();
    }
    organisations: IOrganisation[];
    users: IUser[];
}

@Injectable()
export class InitialisationService {
    constructor(
        @Inject('OrganisationModelToken') private readonly organisationModel: Model<IOrganisationSchema>,
        @Inject('UserModelToken') private readonly userModel: Model<IUserSchema>,
        private userService: UserService,
        private organisationService: OrganisationService) { }

    /**
     * User+Organisation data is expected to be as follows:
     * - no object has an UUID (*Id property)
     * - Organisation does not specify rolesOfUsers
     * - Users may leave capabilities and rolesInOrganisations blank
     * - organisation of User.rolesInOrganisation is identified by name
     */
    async init(): Promise<void> {
        const importDataFlag = `${process.env.IMPORT_INITIAL_DATA}` === 'true';

        //console.log('Starting to initialise DB');
        if (importDataFlag) {
            try {
                const importDataJson = fs.readFileSync('importInitData.json');
                const importData = JSON.parse(importDataJson.toString()) as ImportData;

                await this.loadUserAndOrganisationData(importData);

                console.log("Import of initialisation data successful");
            } catch (e) {
                console.error(e);
            }
        }
    }

    async loadUserAndOrganisationData(data: ImportData) {

        await this.userModel.collection.remove({});
        await this.organisationModel.collection.remove({});

        // first, store organisations
        const organisations = Array<OrganisationDto>(); // to easily get org-id by name
        for (const io of data.organisations) {
            const o: OrganisationDto = {
                organisationId: null,
                name: io.name,
                version: null,
                rolesOfUsers: []
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
            await this.userService.updateUserPasswordAsync(us.userId, iu.password);

            // fourth, add user to organisation
            if (iu.rolesInOrganisations)
                iu.rolesInOrganisations.forEach(async r => {
                    const org = organisations.find(o => o.name === r.organisationName);
                    const roles = r.roles.map(rs => UserRole[rs]);
                    await this.organisationService.addUserToOrganisationAsync({
                        organisationId: org.organisationId,
                        userId: us.userId,
                        alias: null,
                        roles: roles
                    } as UserInOrganisationDto);
                });
        }
    }
}

export const initialisationPovider = {
    provide: 'DbInit',
    useFactory: async (initialisationService: InitialisationService) => {

        return await initialisationService.init();
    },
    inject: [InitialisationService],
};
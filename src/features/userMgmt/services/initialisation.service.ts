import { Injectable,  Inject, HttpException, HttpStatus } from '@nestjs/common';

import * as fs from 'fs';

import { OrganisationService } from './organisation.service';
import { UserService } from './user.service';
import { OrganisationFactory } from '../models/factories/organisation.factory';
import { UserRole, IUser, UserCapability } from '../models/interfaces/user.interface';
import { UserFactory } from '../models/factories/user.factory';
import { Model } from 'mongoose';
import { IOrganisationSchema } from '../database/interfaces/organisation.schema.interface';
import { IUserSchema } from '../database/interfaces/user.schema.interface';
import { IRoleInOrganisation } from '../models/interfaces/roleinorganisation.interface';
import { IRoleOfUser } from '../models/interfaces/roleofuser.interface';
import { IOrganisation } from '../models/interfaces/organisation.interface';
import { RoleOfUserDto } from '../models/dtos/roleofuser.dto';

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
    async init() : Promise<void> {
        const importDataFlag = `${process.env.IMPORT_INITIAL_DATA}` === 'true';

        //console.log('Starting to initialise DB');
        if (importDataFlag) {
            try {
                const importDataJson = fs.readFileSync('importInitData.json');
                const importData = JSON.parse(importDataJson.toString());

                await this.userModel.collection.remove( { } );
                await this.organisationModel.collection.remove( { } );

                // 4 steps
                // 1. parse import data
                // 2. fill missing data in importData
                // 3. store everything in DB
                // 4. complete DB storage with DB ObjectId keys --- if even necesssary
                const userData = this.parseImportedUserData(importData);
                this.makeImportedUserDataComplete(userData);
                this.storeImportedUserData(userData);
            } catch (e) {
                console.error(e);
            }
        }
    }

    parseImportedUserData(data: any): ImportedUserData {
        const res = new ImportedUserData();

        for (const o of data.organisations) {
            const org = OrganisationFactory.generateOrganisationFromJson(o);
            if (org == null) continue;
            res.organisations.push(org);
        }

        for (const u of data.users) {
            const usr = UserFactory.generateUserFromJson(u);
            if (usr == null) continue;

            if (u.capabilities) usr.capabilities = u.capabilities.map((c) => UserCapability[c]); // TODO is this mapping String=>Enum even necessary?

            if (u.rolesInOrganisations)
                usr.rolesInOrganisations = u.rolesInOrganisations.map((r) => {
                    const rio = UserFactory.generateRoleInOrganisationFromJson(r);

                    if (!r.roles) throw new Error("Initialisation data must provide UserRole for each roleInOrganisation");
                    rio.userRoles = r.roles.map((rs) => UserRole[rs]); // TODO is this mapping String=>Enum even necessary?

                    return rio;
                });

            res.users.push(usr);
        }

        return res;
    }

    makeImportedUserDataComplete(data: ImportedUserData) {
        for (const o of data.organisations) {
            if (o.organisationId) throw new Error("Initialisation data must not contain organisationIds");
            o.organisationId = OrganisationFactory.getId();
        }

        for (const u of data.users) {
            if (u.userId) throw new Error("Initialisation data must not contain userIds");
            u.userId = UserFactory.getId();

            for (const r of u.rolesInOrganisations) {
                if (r.organisationId) throw new Error("Initialisation data must not contain organisationIds");

                const org = data.organisations.find((o) => o.name === r.organisationName);
                if (!org) throw new Error(`Could not find organisation with name ${r.organisationName}`);
                r.organisationId = org.organisationId;

                const roleOfUser = Object.create(RoleOfUserDto.prototype) as IRoleOfUser;
                roleOfUser.userId = u.userId;
                roleOfUser.userEmail = u.email;
                roleOfUser.userRoles = r.userRoles; // TODO test if this is sufficient to create a copy
                org.rolesOfUsers.push(roleOfUser);
            }
        }
    }

    storeImportedUserData(data: ImportedUserData) {
        for (const o of data.organisations) {
            const model = new this.organisationModel(o);
            // const res = await model.save();
            const res = model.save();
            console.log(`Storage of organisation ${o.name} lead to ${res}`);
        }

        for (const u of data.users) {
            const model = new this.userModel(u);
            // const res = await model.save();
            const res = model.save();
            console.log(`Storage of user ${u.email} lead to ${res}`);
        }
    }

    async importOrgsAsync(organisations: object[]): Promise<void> {
        if (organisations.length === 0) return;

        for (const o of organisations) {
            const org = OrganisationFactory.generateOrganisationFromJson(o);

            if (org == null)
                continue;

            if (org.rolesOfUsers && org.rolesOfUsers.length)
                throw new Error("Initialisation script only supports organisations w/o users");

            // const users = org.users;
            // org.users = new Array<IRoleOfUser>();

            const orgDto = await this.organisationService.createOrganisationAsync(org).catch(err => console.error(err));

            // if (orgDto && users) {
            //     // add users to org
            //     users.forEach(async user => {
            //         const usrModel = await this.userService.getUserByIdAsync(user.userId).then((u) => this.userService.createOrUpdateUserAsync(u));
            //         await this.organisationService.addUserToOrganisationAsync(orgDto.organisationId, [UserRole.ProcessCoordinator], usrModel)
            //             .catch(err => console.error(err));
            //     });
            // }
        }
    }

    async importUsersAsync(users: object[]): Promise<void> {
        if (users.length === 0) return;

        for (const o of users) {
            const usr = UserFactory.generateUserFromJson(o);

            if (usr == null)
                continue;

            const roles = usr.rolesInOrganisations;
            usr.rolesInOrganisations = new Array<IRoleInOrganisation>();

            const usrDto = await this.userService.createUserAsync(usr).catch(err => console.error(err));

            if (usrDto && usr.rolesInOrganisations) {
                // add roles to usr
                usr.rolesInOrganisations.forEach(async role => {
                    const organisation = await this.organisationService.getOrganisationByNameAsync(role.organisationName);
                    role.organisationId = organisation.organisationId;
                    // await this.organisationService.updateOrganisationWithUserAsync(organisation, role, usrDto).catch(err => console.error(err));
                    await this.organisationService.addUserToOrganisationAsync(organisation.organisationId, role.userRoles, usrDto)
                            .catch(err => console.error(err));
                });
            }
        }
    }
}

export const initialisationPovider = {
    provide: 'DbInit',
    useFactory: async (initialisationService : InitialisationService) => {

      return await initialisationService.init();
    },
    inject: [InitialisationService],
  };
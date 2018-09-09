import { v4 } from 'uuid';

import * as util from '../../../../common/util/util';

import { OrganisationDto } from '../dtos/organisation.dto';
import { IOrganisationSchema } from '../../database/interfaces/organisation.schema.interface';
import { IOrganisation } from '../interfaces/organisation.interface';
import { Mongoose, Schema } from 'mongoose';
import { UserInOrganisationDto } from '../dtos/userinorganisation.dto';
import { UserFactory } from './user.factory';
import { IUserSchema } from '../../database/interfaces/user.schema.interface';

export class OrganisationFactory {
    public static createOrganisation(model: IOrganisationSchema, embedUserObject: boolean) {
        const org = util.mapDto(model, OrganisationDto);
        if (model.populated('users')) {
            if (model.users.length === 0) console.log("0 users for organisation " + model.organisationId);

            org.users = model.users.map(u => {
                if (embedUserObject)
                    u.user.rolesInOrganisations = [];

                return {
                    organisationIsObject: false,
                    organisation: null,
                    organisationId: org.organisationId, // NOTE may be omitted, since it's parent org
                    organisationName: org.name, // NOTE may be omitted, since it's parent org
                    userIsObject: embedUserObject,
                    // NOTE (cast in next line) we KNOW that model.users.user are Schema objects...
                    user: embedUserObject ? UserFactory.createUser(u.user as IUserSchema, false) : null,
                    userId: embedUserObject ? null : u.user.userId,
                    userEmail: embedUserObject ? null : u.user.email,
                    userAlias: u.userAlias,
                    roles: u.roles
                } as UserInOrganisationDto;
            });
        }
        else
            org.users = [];

        return org;
    }

    public static generateOrganisationFromJson(data): IOrganisation {
        //data.organisationId = util.getId();
        const organisation = new OrganisationDto();
        Object.assign(organisation, data);

        return organisation;
    }
}
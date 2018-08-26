import { v4 } from 'uuid';

import { OrganisationDto } from '../dtos/organisation.dto';
import { IOrganisationSchema } from '../../database/interfaces/organisation.schema.interface';
import { mapDto } from '../../../../main/util/util';
import { IOrganisation } from '../interfaces/organisation.interface';
import { Mongoose, Schema } from 'mongoose';
import { UserInOrganisationDto } from '../dtos/userinorganisation.dto';

export class OrganisationFactory {
    public static createOrganisation(model: IOrganisationSchema, embedUserObject: boolean = true) {
        const org = mapDto(model, OrganisationDto);
        if (model.populated('users')) {
            if (model.users.length === 0) console.log("0 users for organisation " + model.organisationId);
            model.users.forEach(u => org.users.push( {
                                    organisationIsObject: false,
                                    organisation: null,
                                    organisationId: org.organisationId, // NOTE may be omitted, since it's parent org
                                    organisationName: org.name, // NOTE may be omitted, since it's parent org
                                    userIsObject: embedUserObject,
                                    user: embedUserObject ? u.user : null,
                                    userId: embedUserObject ? null : u.user.userId,
                                    userEmail: embedUserObject ? null : u.user.email,
                                    userAlias: u.userAlias,
                                    roles: u.roles
                            } as UserInOrganisationDto ));
        }
        return org;
    }

    public static generateOrganisationFromJson(data) : IOrganisation {
        //data.organisationId = v4();
        const organisation = new OrganisationDto();
        Object.assign(organisation, data);

        return organisation;
    }

    public static getId() : string {
        return v4();
    }
}
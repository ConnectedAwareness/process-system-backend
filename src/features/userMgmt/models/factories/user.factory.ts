import { v4 } from 'uuid';

import { UserDto } from '../dtos/user.dto';
import { IUserSchema } from '../../database/interfaces/user.schema.interface';
import { mapDto } from '../../../../main/util/util';
import { IUser } from '../interfaces/user.interface';
import { IUserInOrganisation } from '../interfaces/userinorganisation.interface';
import { UserInOrganisationDto } from '../dtos/userinorganisation.dto';
import { OrganisationFactory } from './organisation.factory';
import { IOrganisationSchema } from '../../database/interfaces/organisation.schema.interface';

export class UserFactory {
    public static createUser(model: IUserSchema, embedOrganisationObject: boolean) {
        const user = mapDto(model, UserDto);

        if (model.populated('rolesInOrganisations')) {
            user.rolesInOrganisations = model.rolesInOrganisations.map(o => {
                if (embedOrganisationObject)
                    o.organisation.users = [];

                return {
                    organisationIsObject: embedOrganisationObject,
                    // NOTE (cast in next line) we KNOW that model.rolesInOrganisations.organisation are Schema objects...
                    organisation: embedOrganisationObject ?
                        OrganisationFactory.createOrganisation(o.organisation as IOrganisationSchema, false) : null,
                    organisationId: embedOrganisationObject ? null : o.organisation.organisationId,
                    organisationName: embedOrganisationObject ? null : o.organisation.name,
                    userIsObject: false,
                    user: null,
                    userId: user.userId, // NOTE may be omitted, since it's parent user
                    userEmail: user.email, // NOTE may be omitted, since it's parent user
                    userAlias: o.userAlias,
                    roles: o.roles
                } as UserInOrganisationDto;
            });
        }
        else
            user.rolesInOrganisations = [];

        return user;
    }

    public static generateUserFromJson(data) : IUser {
        //data.userId = v4();
        const user = new UserDto();
        Object.assign(user, data);

        return user;
    }

    public static generateUserInOrganisationFromJson(data) : IUserInOrganisation {
        const userInOrg = new UserInOrganisationDto();
        Object.assign(userInOrg, data);

        return userInOrg;
    }

    public static getId() : string {
        return v4();
    }
}
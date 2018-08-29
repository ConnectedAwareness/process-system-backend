import { v4 } from 'uuid';

import { UserDto } from '../dtos/user.dto';
import { IUserSchema } from '../../database/interfaces/user.schema.interface';
import { mapDto } from '../../../../main/util/util';
import { IUser } from '../interfaces/user.interface';
import { IUserInOrganisation } from '../interfaces/userinorganisation.interface';
import { UserInOrganisationDto } from '../dtos/userinorganisation.dto';

export class UserFactory {
    public static createUser(model: IUserSchema, embedUserObject: boolean = true) {
        const user = mapDto(model, UserDto);

        if (model.populated('rolesInOrganisations')) {
            user.rolesInOrganisations = model.rolesInOrganisations.map(o => {
                if (embedUserObject)
                    o.organisation.users = [];

                return {
                    organisationIsObject: embedUserObject,
                    organisation: embedUserObject ? o.organisation : null,
                    organisationId: embedUserObject ? o.organisation.organisationId : null,
                    organisationName: embedUserObject ? o.organisation.name : null,
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
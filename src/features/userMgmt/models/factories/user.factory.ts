
import * as util from '../../../../common/util/util';

import { UserDto } from '../dtos/user.dto';
import { IUserSchema } from '../../database/interfaces/user.schema.interface';
import { IUser } from '../../../../../npm-interfaces/src/userMgmt/user.interface';
import { IUserInOrganisation } from '../../../../../npm-interfaces/src/userMgmt/userinorganisation.interface';
import { UserInOrganisationDto } from '../dtos/userinorganisation.dto';
import { OrganisationFactory } from './organisation.factory';
import { IOrganisationSchema } from '../../database/interfaces/organisation.schema.interface';

export class UserFactory {
    public static createUser(model: IUserSchema, embedOrganisationObject: boolean) {
        const user = util.mapDto(model, UserDto);

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
        const user = new UserDto();
        Object.assign(user, data);

        return user;
    }

    public static generateUserInOrganisationFromJson(data) : IUserInOrganisation {
        const userInOrg = new UserInOrganisationDto();
        Object.assign(userInOrg, data);

        return userInOrg;
    }
}
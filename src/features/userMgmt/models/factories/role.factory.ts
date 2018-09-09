import { v4 } from 'uuid';

import { IUserSchema } from '../../database/interfaces/user.schema.interface';
import { IUserInOrganisation } from '../interfaces/userinorganisation.interface';
import { UserInOrganisationDto } from '../dtos/userinorganisation.dto';
import { OrganisationFactory } from './organisation.factory';
import { IOrganisationSchema } from '../../database/interfaces/organisation.schema.interface';
import { UserFactory } from './user.factory';
import { IUserInOrganisationSchema } from '../../database/interfaces/userinorganisation.schema.interface';

export class RoleFactory {
    public static createRole(model: IUserInOrganisationSchema, embedUserObject: boolean, embedOrganisationObject: boolean) {
        if (embedUserObject)
            model.user.rolesInOrganisations = [];

        if (embedOrganisationObject)
            model.organisation.users = [];

        return {
            organisationIsObject: embedOrganisationObject,
            // NOTE (cast in next line) we KNOW that model.rolesInOrganisations.organisation are Schema objects...
            organisation: embedOrganisationObject ?
                OrganisationFactory.createOrganisation(model.organisation as IOrganisationSchema, false) : null,
            organisationId: embedOrganisationObject ? null : model.organisation.organisationId,
            organisationName: embedOrganisationObject ? null : model.organisation.name,
            userIsObject: embedUserObject,
            // NOTE (cast in next line) we KNOW that model.users.user are Schema objects...
            user: embedUserObject ? UserFactory.createUser(model.user as IUserSchema, false) : null,
            userId: embedUserObject ? null : model.user.userId,
            userEmail: embedUserObject ? null : model.user.email,
            userAlias: model.userAlias,
            roles: model.roles
        } as UserInOrganisationDto;
    }

    public static generateUserInOrganisationFromJson(data) : IUserInOrganisation {
        const userInOrg = new UserInOrganisationDto();
        Object.assign(userInOrg, data);

        return userInOrg;
    }
}
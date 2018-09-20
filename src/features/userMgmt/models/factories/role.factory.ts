import { IUserSchema } from '../../database/interfaces/user.schema.interface';
import { IRole } from '../../../../../npm-interfaces/src/userMgmt/role.interface';
import { RoleDto } from '../dtos/role.dto';
import { OrganisationFactory } from './organisation.factory';
import { IOrganisationSchema } from '../../database/interfaces/organisation.schema.interface';
import { UserFactory } from './user.factory';
import { IRoleSchema } from '../../database/interfaces/role.schema.interface';

export class RoleFactory {
    public static createRole(model: IRoleSchema, embedUserObject: boolean, embedOrganisationObject: boolean) {
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
            userRoles: model.userRoles
        } as RoleDto;
    }

    public static generateRoleFromJson(data) : IRole {
        const userInOrg = new RoleDto();
        Object.assign(userInOrg, data);

        return userInOrg;
    }
}
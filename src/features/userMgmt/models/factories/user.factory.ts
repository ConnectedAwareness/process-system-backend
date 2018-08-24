import { v4 } from 'uuid';

import { UserDto } from '../dtos/user.dto';
import { IUserSchema } from '../../database/interfaces/user.schema.interface';
import { mapDto } from '../../../../main/util/util';
import { IUser } from '../interfaces/user.interface';
import { IRoleInOrganisation } from '../interfaces/roleinorganisation.interface';
import { RoleInOrganisationDto } from '../dtos/roleinorganisation.dto';

export class UserFactory {
    public static createUser(model: IUserSchema) {
        return mapDto(model, UserDto);
    }

    public static generateUserFromJson(data) : IUser {
        //data.userId = v4();
        const user = new UserDto();
        Object.assign(user, data);

        return user;
    }

    public static generateRoleInOrganisationFromJson(data) : IRoleInOrganisation {
        const roleInOrg = new RoleInOrganisationDto();
        Object.assign(roleInOrg, data);

        return roleInOrg;
    }

    public static getId() : string {
        return v4();
    }
}
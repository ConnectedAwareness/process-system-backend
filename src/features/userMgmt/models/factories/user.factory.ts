import { v4 } from 'uuid';

import { UserDto } from '../dtos/user.dto';
import { IUserSchema } from '../../database/interfaces/user.schema.interface';
import { mapDto } from '../../../../main/util/util';
import { IUser } from '../interfaces/user.interface';

export class UserFactory {
    public static create(model: IUserSchema) {
        return mapDto(model, UserDto);
    }

    public static generateFromJson(data) : IUser {
        //data.userId = v4();
        let user = Object.create(UserDto.prototype) as IUser;
        user =  Object.assign(data, JSON, {});

        return user;
    }

    public static getId() : string {
        return v4();
    }
}
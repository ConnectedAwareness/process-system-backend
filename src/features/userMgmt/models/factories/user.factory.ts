import { v4 } from 'uuid';

import { UserDto } from '../dtos/user.dto';
import { IUser } from '../interfaces/user.interface';
import { mapDto } from '../../../../main/util/util';

export class UserFactory {
    public static create(model: IUser) {
        return mapDto(model, UserDto);
    }

    public static generateFromJson(data) : UserDto {
        //data.userId = v4();
        let user = Object.create(UserDto.prototype) as UserDto;
        user =  Object.assign(data, JSON, {});

        return user;
    }

    public static getId() : string {
        return v4();
    }
}
import { ApiModelProperty } from '@nestjs/swagger';
import { UserRole } from '../interfaces/user.interface';
import { IRoleOfUser } from '../interfaces/roleofuser.interface';
import { UserDto } from './user.dto';

export class RoleOfUserDto implements IRoleOfUser {
    constructor() {
        this.user = null;
        this.userAlias = null;
        this.userRoles = new Array<UserRole>();
    }

    @ApiModelProperty({type: UserDto, required: false })
    readonly user: UserDto;
    @ApiModelProperty({type: String, required: false })
    readonly userAlias: string;
    @ApiModelProperty({ type: UserRole, isArray: true, required: true })
    readonly userRoles: UserRole[];
}
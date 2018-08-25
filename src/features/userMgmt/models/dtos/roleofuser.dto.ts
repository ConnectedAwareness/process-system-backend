import { ApiModelProperty } from '@nestjs/swagger';
import { UserRole } from '../interfaces/user.interface';
import { IRoleOfUser } from '../interfaces/roleofuser.interface';

export class RoleOfUserDto implements IRoleOfUser {
    constructor() {
        this.userId = null;
        this.userEmail = null;
        this.userAlias = null;
        this.userRoles = new Array<UserRole>();
    }

    @ApiModelProperty({type: String, required: false })
    readonly userId: string;
    @ApiModelProperty({type: String, required: false })
    readonly userEmail: string;
    @ApiModelProperty({type: String, required: false })
    readonly userAlias: string;
    @ApiModelProperty({ type: UserRole, isArray: true, required: true })
    readonly userRoles: UserRole[];
}
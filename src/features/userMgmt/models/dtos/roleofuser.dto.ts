import { ApiModelProperty } from '@nestjs/swagger';
import { UserRole } from '../interfaces/user.interface';
import { IRoleOfUser } from '../interfaces/roleofuser.interface';

export class RoleOfUserDto implements IRoleOfUser {
    constructor() {
        this.localUserAlias = null;
        this.roles = new Array<UserRole>();
        this.userId = null;
        this.userEmail = null;
    }

    @ApiModelProperty({type: String, required: false })
    readonly localUserAlias: string;
    @ApiModelProperty({ type: UserRole, isArray: true, required: true })
    readonly roles: UserRole[];
    @ApiModelProperty({type: String, required: false })
    readonly userId: string;
    @ApiModelProperty({type: String, required: false })
    readonly userEmail: string;
}
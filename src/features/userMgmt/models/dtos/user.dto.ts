import { ApiModelProperty } from '@nestjs/swagger';
import { IUser, UserCapability } from '../../../../../npm-interfaces/src/userMgmt/user.interface';
import { IRole } from '../../../../../npm-interfaces/src/userMgmt/role.interface';
import { RoleDto } from './role.dto';

export class UserDto implements IUser {
    constructor() {
        this.userId = null;
        this.email = null;
        this.firstName = null;
        this.lastName = null;
        this.capabilities = new Array<UserCapability>();
        this.rolesInOrganisations = new Array<IRole>();
    }

    @ApiModelProperty({ type: String, required: false })
    userId: string;
    @ApiModelProperty({ type: String, required: true })
    email: string;
    @ApiModelProperty({ type: String, required: false })
    firstName: string;
    @ApiModelProperty({ type: String, required: false })
    lastName: string;
    @ApiModelProperty({ type: UserCapability, isArray: true, required: true })
    capabilities: UserCapability[];
    @ApiModelProperty({ type: RoleDto, isArray: true, required: false })
    rolesInOrganisations: IRole[];
}
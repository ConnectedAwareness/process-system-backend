import { ApiModelProperty } from '@nestjs/swagger';
import { IUser, UserCapability } from '../interfaces/user.interface';
import { IRoleInOrganisation } from '../interfaces/roleinorganisation.interface';

export class UserDto implements IUser {
    constructor() {
        this.userId = null;
        this.email = null;
        this.firstName = null;
        this.lastName = null;
        this.capabilities = new Array<UserCapability>();
        this.rolesInOrganisations = new Array<IRoleInOrganisation>();
    }

    @ApiModelProperty({ type: String, required: false })
    readonly userId: string;
    @ApiModelProperty({ type: String, required: true })
    readonly email: string;
    @ApiModelProperty({ type: String, required: false })
    readonly firstName: string;
    @ApiModelProperty({ type: String, required: false })
    readonly lastName: string;
    @ApiModelProperty({ type: UserCapability, isArray: true, required: true })
    readonly capabilities: UserCapability[];
    @ApiModelProperty({ type: IRoleInOrganisation, isArray: true, required: false })
    readonly rolesInOrganisations: IRoleInOrganisation[];
}
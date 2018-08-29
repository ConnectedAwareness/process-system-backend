import { ApiModelProperty } from '@nestjs/swagger';
import { IUser, UserCapability } from '../interfaces/user.interface';
import { IUserInOrganisation } from '../interfaces/userinorganisation.interface';

export class UserDto implements IUser {
    constructor() {
        this.userId = null;
        this.email = null;
        this.firstName = null;
        this.lastName = null;
        this.capabilities = new Array<UserCapability>();
        this.rolesInOrganisations = new Array<IUserInOrganisation>();
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
    @ApiModelProperty({ type: IUserInOrganisation, isArray: true, required: false })
    rolesInOrganisations: IUserInOrganisation[];
}
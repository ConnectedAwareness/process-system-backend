import { ApiModelProperty } from '@nestjs/swagger';
import { IRoleInOrganisation } from '../interfaces/roleinorganisation.interface';
import { UserRole } from '../interfaces/user.interface';

export class RoleInOrganisationDto implements IRoleInOrganisation {
    constructor() {
        this.userAlias = null;
        this.userRoles = new Array<UserRole>();
        this.organisationId = null;
        this.organisationName = null;
    }

    @ApiModelProperty({type: String, required: false })
    readonly userAlias: string;
    @ApiModelProperty({ type: UserRole, isArray: true, required: true })
    readonly userRoles: UserRole[];
    @ApiModelProperty({type: String, required: false })
    readonly organisationId: string;
    @ApiModelProperty({type: String, required: false })
    readonly organisationName: string;
}
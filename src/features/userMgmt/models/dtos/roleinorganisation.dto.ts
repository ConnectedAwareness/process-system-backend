import { ApiModelProperty } from '@nestjs/swagger';
import { IRoleInOrganisation } from '../interfaces/roleinorganisation.interface';
import { UserRole } from '../interfaces/user.interface';
import { OrganisationDto } from './organisation.dto';

export class RoleInOrganisationDto implements IRoleInOrganisation {
    constructor() {
        this.userAlias = null;
        this.userRoles = new Array<UserRole>();
        this.organisation = null;
    }

    @ApiModelProperty({type: String, required: false })
    readonly userAlias: string;
    @ApiModelProperty({ type: UserRole, isArray: true, required: true })
    readonly userRoles: UserRole[];
    @ApiModelProperty({type: OrganisationDto, required: false })
    readonly organisation: OrganisationDto;
}
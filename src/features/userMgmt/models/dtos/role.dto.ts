import { ApiModelProperty } from '@nestjs/swagger';
import { UserRole } from '../../../../../npm-interfaces/src/userMgmt/user.interface';
import { IRole } from '../../../../../npm-interfaces/src/userMgmt/role.interface';
import { UserDto } from './user.dto';
import { OrganisationDto } from './organisation.dto';

export class RoleDto implements IRole {
    constructor() {
        this.organisation = null;
        this.organisationIsObject = false;
        this.organisationId = null;
        this.organisationName = null;
        this.user = null;
        this.userIsObject = false;
        this.userId = null;
        this.userEmail = null;
        this.userAlias = null;
        this.userRoles = new Array<UserRole>();
    }

    @ApiModelProperty({type: OrganisationDto, required: false })
    organisation: OrganisationDto;
    @ApiModelProperty({type: Boolean, required: false })
    organisationIsObject: boolean;
    @ApiModelProperty({type: String, required: false })
    organisationId: string;
    @ApiModelProperty({type: String, required: false })
    organisationName: string;
    // @ApiModelProperty({type: UserDto, required: false })
    user: UserDto;
    @ApiModelProperty({type: Boolean, required: false })
    userIsObject: boolean;
    @ApiModelProperty({type: String, required: false })
    userId: string;
    @ApiModelProperty({type: String, required: false })
    userEmail: string;
    @ApiModelProperty({type: String, required: false })
    userAlias: string;
    @ApiModelProperty({ type: UserRole, isArray: true, required: true })
    userRoles: UserRole[];
}
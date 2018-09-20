import { ApiModelProperty } from '@nestjs/swagger';
import { UserRole } from '../../../../../npm-interfaces/src/userMgmt/user.interface';
import { IUserInOrganisation } from '../../../../../npm-interfaces/src/userMgmt/userinorganisation.interface';
import { UserDto } from './user.dto';
import { OrganisationDto } from './organisation.dto';

export class UserInOrganisationDto implements IUserInOrganisation {
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
        this.roles = new Array<UserRole>();
    }

    @ApiModelProperty({type: OrganisationDto, required: false })
    readonly organisation: OrganisationDto;
    @ApiModelProperty({type: Boolean, required: false })
    readonly organisationIsObject: boolean;
    @ApiModelProperty({type: String, required: false })
    readonly organisationId: string;
    @ApiModelProperty({type: String, required: false })
    readonly organisationName: string;
    @ApiModelProperty({type: UserDto, required: false })
    readonly user: UserDto;
    @ApiModelProperty({type: Boolean, required: false })
    readonly userIsObject: boolean;
    @ApiModelProperty({type: String, required: false })
    readonly userId: string;
    @ApiModelProperty({type: String, required: false })
    readonly userEmail: string;
    @ApiModelProperty({type: String, required: false })
    readonly userAlias: string;
    @ApiModelProperty({ type: UserRole, isArray: true, required: true })
    readonly roles: UserRole[];
}
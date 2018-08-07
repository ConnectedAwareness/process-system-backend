import { ApiModelProperty } from '@nestjs/swagger';
import { IUser } from '../interfaces/user.interface';

export class UserDto implements IUser {
    constructor() {
        this.userId = null;
        this.email = null;
        this.alias = null;
        this.firstName = null;
        this.lastName = null;
        this.roles = null;
        //this.organisation = null;
    }

    @ApiModelProperty({ type: String, required: false })
    readonly userId: string;
    @ApiModelProperty({ type: String, required: true })
    readonly email: string;
    @ApiModelProperty({ type: String, required: false })
    readonly alias: string;
    @ApiModelProperty({ type: String, required: false })
    readonly firstName: string;
    @ApiModelProperty({ type: String, required: false })
    readonly lastName: string;
    @ApiModelProperty({ type: [String], isArray: true, required: false })
    readonly roles: [string];
    //@ApiModelProperty({ type: OrganisationDto, required: false })
    //readonly organisation: OrganisationDto;
}
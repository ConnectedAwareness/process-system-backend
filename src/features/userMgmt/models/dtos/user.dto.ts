import { ApiModelProperty } from '@nestjs/swagger';

export class UserDto {
    constructor() {
        this.email = null;
        this.password = null;
        this.alias = null;
        this.first_name = null;
        this.last_name = null;
        this.token = null;
        this.roles = null;
    }

    @ApiModelProperty({ type: String, required: true })
    readonly email: string;
    @ApiModelProperty({ type: String, required: true })
    readonly password: string;
    @ApiModelProperty({ type: String, required: false })
    readonly alias: string;
    @ApiModelProperty({ type: String, required: false })
    readonly first_name: string;
    @ApiModelProperty({ type: String, required: false })
    readonly last_name: string;
    @ApiModelProperty({ type: String, required: false })
    readonly token: string;
    @ApiModelProperty({ type: [String], required: false })
    readonly roles: [string];
}
import { ApiModelProperty } from "@nestjs/swagger";

export class AuthRequestDto {
    constructor() {
        this.email = null;
        this.password = null;
    }

    @ApiModelProperty({ type: String, required: true })
    readonly email: string;
    @ApiModelProperty({ type: String, required: true })
    readonly password: string;
}
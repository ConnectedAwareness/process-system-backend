import { ApiModelProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
    constructor() {
        this.userId = null;
        this.password = null;
    }

    @ApiModelProperty({ type: String, required: true })
    readonly userId: string;
    @ApiModelProperty({ type: String, required: true })
    readonly password: string;
}
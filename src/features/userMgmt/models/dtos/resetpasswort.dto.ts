import { ApiModelProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
    constructor() {
        this.userId = null;
        this.oldPassword = null;
        this.newPassword = null;
    }

    @ApiModelProperty({ type: String, required: true })
    readonly userId: string;
    @ApiModelProperty({ type: String, required: true })
    readonly oldPassword: string;
    @ApiModelProperty({ type: String, required: true })
    readonly newPassword: string;
}
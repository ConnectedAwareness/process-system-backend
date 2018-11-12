import { ApiModelProperty } from "@nestjs/swagger";

export class TokenResponseDto {
    constructor() {
        this.token = null;
        this.message = null;
    }

    @ApiModelProperty({ type: String, required: true })
    token: string;
    @ApiModelProperty({ type: String, required: false })
    message: string;
}
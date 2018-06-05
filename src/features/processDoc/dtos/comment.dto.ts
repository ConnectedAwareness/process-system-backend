import { ApiModelProperty } from '@nestjs/swagger';

export class CommentDto {
  constructor() {
    this.userid = null;
    this.comment = null;
    this.vote =  null;
  }

  @ApiModelProperty({type: String, required: true})
  readonly userid: string;
  @ApiModelProperty({type: String, required: false})
  readonly comment: string;
  @ApiModelProperty({type: String, required: false})
  readonly vote: number;
}
import { ApiModelProperty } from '@nestjs/swagger';

import { CommentDto } from './comment.dto';

export class OrgDto {
  constructor() {
    this.organisationId = null;
    this.comments = new Array<CommentDto>();
  }

  @ApiModelProperty({type: String, required: true})
  readonly organisationId: string;
  @ApiModelProperty({type: Object, isArray: true, required: false })
  readonly comments: Array<CommentDto>;
}
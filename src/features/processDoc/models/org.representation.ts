import { ApiModelProperty } from '@nestjs/swagger';

import { IComment, Comment } from './comment.representation';

export interface IOrg {
    organisationId: string;
    comments: Array<IComment>;
}

export class Org {
  constructor() {
    this.organisationId = null;
    this.comments = new Array<Comment>();
  }

  @ApiModelProperty({type: String, required: true})
  readonly organisationId: string;
  @ApiModelProperty({type: Object, isArray: true, required: false })
  readonly comments: Array<Comment>;
}
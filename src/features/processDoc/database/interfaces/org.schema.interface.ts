import { ApiModelProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

import { ICommentSchema } from './comment.schema.interface';

export interface IOrgSchema extends Document {
  readonly organisationId: string;
  readonly comments: Array<ICommentSchema>;
}
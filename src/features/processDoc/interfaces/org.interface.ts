import { ApiModelProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

import { IComment } from './comment.interface';

export interface IOrg extends Document {
  readonly organisationId: string;
  readonly comments: Array<IComment>;
}
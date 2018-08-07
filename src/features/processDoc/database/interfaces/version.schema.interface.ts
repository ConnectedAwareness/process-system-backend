import { Document } from 'mongoose';

import { IElementSchema } from './element.schema.interface';

export interface IVersionSchema extends Document {
  readonly versionId: string;
  readonly published: boolean;
  readonly elements: IElementSchema[];
}
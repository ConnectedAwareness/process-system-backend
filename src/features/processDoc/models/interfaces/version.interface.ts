import { Document } from 'mongoose';

import { IElement } from './element.interface';

export interface IVersion extends Document {
  readonly versionId: string;
  readonly published: boolean;
  readonly elements: IElement[];
}
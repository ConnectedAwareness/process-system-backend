import { Document } from 'mongoose';

import { IElement } from '../../../../../npm-interfaces/src/processDoc/element.interface';
import { IElementVersionSchema } from './elementversion.schema.interface';

export interface IElementSchema extends Document, IElement {
    elementVersions: IElementVersionSchema[];
}
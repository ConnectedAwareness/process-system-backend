import { Document } from 'mongoose';

import { IElement } from '../../models/interfaces/element.interface';
import { IElementVersionSchema } from './elementversion.schema.interface';

export interface IElementSchema extends Document, IElement {
    elementVersions: IElementVersionSchema[];
}
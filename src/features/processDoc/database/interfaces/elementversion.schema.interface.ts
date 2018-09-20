import { Document } from 'mongoose';
import { IElementVersion } from '../../../../../npm-interfaces/src/processDoc/elementversion.interface';
import { IElementSchema } from './element.schema.interface';

export interface IElementVersionSchema extends Document, IElementVersion {
    element: IElementSchema;
}
import { Document } from 'mongoose';
import { IElementVersion } from '../../models/interfaces/elementversion.interface';
import { IElementSchema } from './element.schema.interface';

export interface IElementVersionSchema extends Document, IElementVersion {
    element: IElementSchema;
}
import { Document } from 'mongoose';

import { IVersion } from '../../models/interfaces/version.interface';
import { INodeSchema } from './node.schema.interface';
import { INodeContainerSchema } from './nodecontainer.schema.interface';

export interface IVersionSchema extends Document, IVersion, INodeContainerSchema {
    nodes: INodeSchema[];
}
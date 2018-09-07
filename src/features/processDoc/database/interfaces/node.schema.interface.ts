import { Document } from 'mongoose';

import { INode } from '../../models/interfaces/node.interface';
import { IElementVersionSchema } from './elementversion.schema.interface';
import { INodeContainerSchema } from './nodecontainer.schema.interface';

export interface INodeSchema extends Document, INode, INodeContainerSchema {
    elementVersion: IElementVersionSchema;
    nodes: INodeSchema[];
}
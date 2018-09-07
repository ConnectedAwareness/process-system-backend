import { Document } from 'mongoose';

import { INode } from '../../models/interfaces/node.interface';
import { IElementVersionSchema } from './elementversion.schema.interface';
import { INodeContainerSchema } from './nodecontainer.schema.interface';

export interface ILinkedNodeSchema extends Document, INode, INodeContainerSchema {
    elementVersion: IElementVersionSchema;
    nodes: ILinkedNodeSchema[];
}
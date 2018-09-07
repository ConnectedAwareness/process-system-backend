import { Document } from 'mongoose';

import { INode } from '../../models/interfaces/node.interface';
import { INodeSchema } from './node.schema.interface';

export interface INodeContainerSchema extends Document, INode {
    nodes: INodeSchema[];
}
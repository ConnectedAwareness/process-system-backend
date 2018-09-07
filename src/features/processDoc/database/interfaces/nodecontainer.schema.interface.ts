import { Document } from 'mongoose';

import { INode } from '../../models/interfaces/node.interface';
import { ITreeNodeSchema } from './treenode.schema.interface';

export interface INodeContainerSchema extends Document, INode {
    nodes: ITreeNodeSchema[];
}
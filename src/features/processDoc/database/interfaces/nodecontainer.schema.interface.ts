import { Document } from 'mongoose';

import { INode } from '../../../../../npm-interfaces/src/processDoc/node.interface';
import { ITreeNodeSchema } from './treenode.schema.interface';

export interface INodeContainerSchema extends Document, INode {
    nodes: ITreeNodeSchema[];
}
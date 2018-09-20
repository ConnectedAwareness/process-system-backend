import { Document } from 'mongoose';

import { IVersion } from '../../../../../npm-interfaces/src/processDoc/version.interface';
import { ITreeNodeSchema } from './treenode.schema.interface';
import { INodeContainerSchema } from './nodecontainer.schema.interface';
import { ILinkedNodeSchema } from './linkednode.schema.interface.';

export interface IVersionSchema extends Document, IVersion, INodeContainerSchema {
    nodes: ITreeNodeSchema[];
    linkedNodeRoot: ILinkedNodeSchema;
}
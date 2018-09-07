import { Connection } from 'mongoose';
import { TreeNodeSchema } from '../schemas/treenode.schema';
import { LinkedNodeSchema } from '../schemas/linkednode.schema';

export const nodeProviders = [
  {
    provide: 'TreeNodeModelToken',
    useFactory: (connection: Connection) => connection.model('TreeNode', TreeNodeSchema),
    inject: ['DbConnectionToken'],
  },
  {
    provide: 'LinkedNodeModelToken',
    useFactory: (connection: Connection) => connection.model('LinkedNode', LinkedNodeSchema),
    inject: ['DbConnectionToken'],
  },
];
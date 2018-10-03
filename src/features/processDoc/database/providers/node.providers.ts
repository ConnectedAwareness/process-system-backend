import { Connection } from 'mongoose';
import { TreeNodeSchema } from '../schemas/treenode.schema';
import { LinkedNodeSchema } from '../schemas/linkednode.schema';
import { TokenNames, SchemaTypeNames } from '../../../../common/util/constants';

export const nodeProviders = [
  { // NOTE maybe not needed
    provide: 'TreeNodeModelToken',
    useFactory: (connection: Connection) => connection.model('TreeNode', TreeNodeSchema),
    inject: ['DbConnectionToken'],
  },
  {
    provide: TokenNames.LinkedNodeModelToken,
    useFactory: (connection: Connection) => connection.model(SchemaTypeNames.LinkedNode, LinkedNodeSchema),
    inject: [TokenNames.DbConnectionToken],
  },
];
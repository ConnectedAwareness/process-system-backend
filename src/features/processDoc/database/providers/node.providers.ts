import { Connection } from 'mongoose';
import { NodeSchema } from '../schemas/node.schema';

export const nodeProviders = [
  {
    provide: 'NodeModelToken',
    useFactory: (connection: Connection) => connection.model('Node', NodeSchema),
    inject: ['DbConnectionToken'],
  },
];
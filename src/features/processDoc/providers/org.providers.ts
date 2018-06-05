import { Connection } from 'mongoose';
import { OrgSchema } from '../schemas/org.schema';

export const orgProviders = [
  {
    provide: 'OrgModelToken',
    useFactory: (connection: Connection) => connection.model('Org', OrgSchema),
    inject: ['DbConnectionToken'],
  },
];
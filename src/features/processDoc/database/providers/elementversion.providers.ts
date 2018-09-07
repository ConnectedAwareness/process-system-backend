import { Connection } from 'mongoose';
import { ElementVersionSchema } from '../schemas/elementversion.schema';

export const elementVersionProviders = [
  {
    provide: 'ElementVersionModelToken',
    useFactory: (connection: Connection) => connection.model('ElementVersion', ElementVersionSchema),
    inject: ['DbConnectionToken'],
  },
];
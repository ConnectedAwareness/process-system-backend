import { Connection } from 'mongoose';
import { VersionSchema } from '../schemas/version.schema';

export const versionProviders = [
  {
    provide: 'VersionModelToken',
    useFactory: (connection: Connection) => connection.model('Version', VersionSchema),
    inject: ['DbConnectionToken'],
  },
];
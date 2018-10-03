import { Connection } from 'mongoose';
import { VersionSchema } from '../schemas/version.schema';
import { TokenNames, SchemaTypeNames } from '../../../../common/util/constants';

export const versionProviders = [
  {
    provide: TokenNames.VersionModelToken,
    useFactory: (connection: Connection) => connection.model(SchemaTypeNames.Version, VersionSchema),
    inject: [TokenNames.DbConnectionToken],
  },
];
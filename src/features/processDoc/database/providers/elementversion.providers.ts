import { Connection } from 'mongoose';
import { ElementVersionSchema } from '../schemas/elementversion.schema';
import { TokenNames, SchemaTypeNames } from '../../../../common/util/constants';

export const elementVersionProviders = [
  {
    provide: TokenNames.ElementVersionModelToken,
    useFactory: (connection: Connection) => connection.model(SchemaTypeNames.ElementVersion, ElementVersionSchema),
    inject: [TokenNames.DbConnectionToken],
  },
];
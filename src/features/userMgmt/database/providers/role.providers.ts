import { Connection } from 'mongoose';
import { RoleSchema } from '../schemas/role.schema';
import { TokenNames, SchemaTypeNames } from '../../../../common/util/constants';

export const roleProviders = [
  {
    provide: TokenNames.RoleModelToken,
    useFactory: (connection: Connection) => connection.model(SchemaTypeNames.Role, RoleSchema),
    inject: [TokenNames.DbConnectionToken],
  },
];
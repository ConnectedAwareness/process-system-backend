import { Connection } from 'mongoose';
import { UserSchema } from '../schemas/user.schema';
import { TokenNames, SchemaTypeNames } from '../../../../common/util/constants';

export const userProviders = [
  {
    provide: TokenNames.UserModelToken,
    useFactory: (connection: Connection) => connection.model(SchemaTypeNames.User, UserSchema),
    inject: [TokenNames.DbConnectionToken],
  }
];
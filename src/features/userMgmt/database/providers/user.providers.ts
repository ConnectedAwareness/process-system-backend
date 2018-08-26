import { Connection } from 'mongoose';
import { UserSchema } from '../schemas/user.schema';
import { UserInOrganisationSchema } from '../schemas/userinorganisation.schema';

export const userProviders = [
  {
    provide: 'UserModelToken',
    useFactory: (connection: Connection) => connection.model('User', UserSchema),
    inject: ['DbConnectionToken'],
  },
  {
    provide: 'UserInOrganisationModelToken',
    useFactory: (connection: Connection) => connection.model('UserInOrganisation', UserInOrganisationSchema),
    inject: ['DbConnectionToken'],
  },
];
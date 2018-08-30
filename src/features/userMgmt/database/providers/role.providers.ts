import { Connection } from 'mongoose';
import { UserInOrganisationSchema } from '../schemas/userinorganisation.schema';

export const roleProviders = [
  {
    provide: 'UserInOrganisationModelToken',
    useFactory: (connection: Connection) => connection.model('UserInOrganisation', UserInOrganisationSchema),
    inject: ['DbConnectionToken'],
  },
];
import { Connection } from 'mongoose';
import { OrganisationSchema } from '../schemas/organisation.schema';

export const organisationProviders = [
  {
    provide: 'OrganisationModelToken',
    useFactory: (connection: Connection) => connection.model('Organisation', OrganisationSchema),
    inject: ['DbConnectionToken'],
  },
];
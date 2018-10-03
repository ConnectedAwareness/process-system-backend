import { Connection } from 'mongoose';
import { OrganisationSchema } from '../schemas/organisation.schema';
import { TokenNames, SchemaTypeNames } from '../../../../common/util/constants';

export const organisationProviders = [
  {
    provide: TokenNames.OrganisationModelToken,
    useFactory: (connection: Connection) => connection.model(SchemaTypeNames.Organisation, OrganisationSchema),
    inject: [TokenNames.DbConnectionToken],
  },
];
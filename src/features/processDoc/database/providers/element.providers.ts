import { Connection } from 'mongoose';
import { ElementSchema } from '../schemas/element.schema';
import { TokenNames, SchemaTypeNames } from '../../../../common/util/constants';

export const elementProviders = [
  {
    provide: TokenNames.ElementModelToken,
    useFactory: (connection: Connection) => connection.model(SchemaTypeNames.Element, ElementSchema),
    inject: [TokenNames.DbConnectionToken],
  },
];
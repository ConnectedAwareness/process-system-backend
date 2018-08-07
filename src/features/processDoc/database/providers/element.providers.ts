import { Connection } from 'mongoose';
import { ElementSchema } from '../schemas/element.schema';

export const elementProviders = [
  {
    provide: 'ElementModelToken',
    useFactory: (connection: Connection) => connection.model('Element', ElementSchema),
    inject: ['DbConnectionToken'],
  },
];
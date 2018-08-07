import { Document } from 'mongoose';
import { IOrganisationSchema } from './organisation.schema.interface';

export interface IUserSchema extends Document {
    userId: string;
    email: string;
    password: string;
    alias: string;
    firstName: string;
    lastName: string;
    roles: [string];
    organisation: IOrganisationSchema;
}
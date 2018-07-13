import { Document } from 'mongoose';
import { IOrganisation } from './organisation.interface';

export interface IUser extends Document {
    userId: string;
    email: string;
    password: string;
    alias: string;
    firstName: string;
    lastName: string;
    roles: [string];
    organisation: IOrganisation;
}
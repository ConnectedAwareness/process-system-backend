import { Document, Schema } from 'mongoose';
import { IUser } from '../../models/interfaces/user.interface';
import { IUserInOrganisationSchema } from './userinorganisation.schema.interface';

export interface IUserSchema extends Document, IUser {
    password: string;
    rolesInOrganisations: IUserInOrganisationSchema[];
}
import { Document, Schema } from 'mongoose';
import { IUser } from '../../../../../npm-interfaces/src/userMgmt/user.interface';
import { IRoleSchema } from './role.schema.interface';

export interface IUserSchema extends Document, IUser {
    password: string;
    rolesInOrganisations: IRoleSchema[];
}
import { Document, Schema } from 'mongoose';
import { IRole } from '../../../../../npm-interfaces/src/userMgmt/role.interface';
import { IUserSchema } from './user.schema.interface';
import { IOrganisationSchema } from './organisation.schema.interface';

export interface IRoleSchema extends Document, IRole {
    organisation: IOrganisationSchema;
    user: IUserSchema;
}
import { Document, Schema } from 'mongoose';
import { IUserInOrganisation } from '../../../../../npm-interfaces/src/userMgmt/userinorganisation.interface';
import { IUserSchema } from './user.schema.interface';
import { IOrganisationSchema } from './organisation.schema.interface';

export interface IUserInOrganisationSchema extends Document, IUserInOrganisation {
    organisation: IOrganisationSchema;
    user: IUserSchema;
}
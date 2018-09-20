import { Document, Schema } from 'mongoose';

import { IOrganisation } from "../../../../../npm-interfaces/src/userMgmt/organisation.interface";
import { IRoleSchema } from './role.schema.interface';

export interface IOrganisationSchema extends Document, IOrganisation {
    users: IRoleSchema[];
}
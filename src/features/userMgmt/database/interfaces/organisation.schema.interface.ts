import { Document, Schema } from 'mongoose';

import { IOrganisation } from "../../models/interfaces/organisation.interface";
import { IUserInOrganisationSchema } from './userinorganisation.schema.interface';

export interface IOrganisationSchema extends Document, IOrganisation {
    users: IUserInOrganisationSchema[];
}
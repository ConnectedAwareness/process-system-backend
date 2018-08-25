import { Document, Schema } from 'mongoose';
import { IRoleInOrganisation } from '../../models/interfaces/roleinorganisation.interface';
import { IOrganisationSchema } from './organisation.schema.interface';

export interface IRoleInOrganisationSchema extends IRoleInOrganisation {
    organisation: IOrganisationSchema;
}
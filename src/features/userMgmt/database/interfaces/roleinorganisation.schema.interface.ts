import { Document, Schema } from 'mongoose';
import { IRoleInOrganisation } from '../../models/interfaces/roleinorganisation.interface';

export interface IRoleInOrganisationSchema extends Document, IRoleInOrganisation {
    _organisationId: Schema.Types.ObjectId;
}
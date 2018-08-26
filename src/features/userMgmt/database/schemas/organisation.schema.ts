import { Schema } from 'mongoose';
import { UserInOrganisationSchema } from './userinorganisation.schema';

export const OrganisationSchema = new Schema({
    organisationId: { type: String, required: true },
    name: { type: String, required: true },
    version: { type: String, required: false },
    users: { type: [Schema.Types.ObjectId], ref: 'UserInOrganisation' }
}
, {collection: 'organisations' }
);

OrganisationSchema.index({ organisationId: -1 }, { unique: true } );
OrganisationSchema.index({ name: -1 }, { unique: true } );
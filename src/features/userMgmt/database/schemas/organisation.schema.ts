import { Schema } from 'mongoose';
import { SchemaTypeNames } from '../../../../common/util/constants';

export const OrganisationSchema = new Schema({
    organisationId: { type: String, required: true },
    name: { type: String, required: true },
    version: { type: String, required: false },
    users: [{ type: Schema.Types.ObjectId, ref: SchemaTypeNames.Role }]
}
, {collection: 'organisations' }
);

OrganisationSchema.index({ organisationId: -1 }, { unique: true } );
OrganisationSchema.index({ name: -1 }, { unique: true } );
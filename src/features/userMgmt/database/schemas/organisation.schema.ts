import { Schema } from 'mongoose';
import { RoleOfUserSchema } from './roleofuser.schema';

export const OrganisationSchema = new Schema({
    organisationId: { type: String, required: true },
    name: { type: String, required: true },
    version: { type: String, required: false },
    rolesOfUsers: { type: [RoleOfUserSchema], required: false }
}
, {collection: 'organisations' }
);

OrganisationSchema.index({ organisationId: -1 }, { unique: true } );
OrganisationSchema.index({ name: -1 }, { unique: true } );
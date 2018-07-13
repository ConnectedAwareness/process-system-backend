import { Schema } from 'mongoose';

export const OrganisationSchema = new Schema({
  organisationId: { type: String, required: true },
  name: { type: String, required: true },
  processCoordinator: { type: Schema.Types.ObjectId, required: false, ref: 'User' },
  version: { type: String, required: false },
  usersInVersion: { type: [Number], required: false },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}
, {collection: 'organisations' }
);

OrganisationSchema.index({ name: -1 }, { unique: true } );

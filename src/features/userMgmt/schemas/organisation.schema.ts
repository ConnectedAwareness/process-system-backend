import * as mongoose from 'mongoose';

import { UserSchema } from './user.schema';

export const OrganisationSchema = new mongoose.Schema({
  organisationId: { type: String, required: true },
  name: { type: String, required: true },
  coordinator_id: { type: Number, required: false },
  version: { type: String, required: false },
  users_in_version: { type: [Number], required: false },
  users: [UserSchema],
}
, {collection: 'organisations' }
);

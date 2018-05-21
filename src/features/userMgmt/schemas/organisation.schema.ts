import * as mongoose from 'mongoose';

export const OrganisationSchema = new mongoose.Schema({
  name: { type: String, required: true },
//   coordinator_id: Number,
  //   users: [UserSchema],
//   version: String,
//   users_in_version: [Number],
});

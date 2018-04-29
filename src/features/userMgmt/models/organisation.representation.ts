// import { User, UserSchema } from "./user.representation";
import * as mongoose from 'mongoose';

export interface IOrganisation {
  name: string;
//   coordinator_id: number;
  // users: [User];
//   version: string;
//   users_in_version: [number];
}

export class Organisation implements IOrganisation {
  readonly name: string;
//   readonly coordinator_id: number;
  // readonly users: [User];
//   readonly version: string;
//   readonly users_in_version: [number];
}

export const OrganisationSchema = new mongoose.Schema({
  name: { type: String, required: true },
//   coordinator_id: Number,
  //   users: [UserSchema],
//   version: String,
//   users_in_version: [Number],
});

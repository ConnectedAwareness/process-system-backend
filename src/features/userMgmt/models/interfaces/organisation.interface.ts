import { Document } from 'mongoose';

import { IUser } from "./user.interface";

export interface IOrganisation extends Document {
  organisationId: string;
  name: string;
  coordinator_id: number;
  version: string;
  users_in_version: [number];
  users: Array<IUser>;
}
import { Document } from 'mongoose';

import { IUserSchema } from "./user.schema.interface";

export interface IOrganisationSchema extends Document {
  organisationId: string;
  name: string;
  processCoordinator: IUserSchema;
  version: string;
  usersInVersion: [number];
  users: Array<IUserSchema>;
}
import { Document } from 'mongoose';

import { IUser } from "./user.interface";

export interface IOrganisation extends Document {
  organisationId: string;
  name: string;
  processCoordinator: IUser;
  version: string;
  usersInVersion: [number];
  users: Array<IUser>;
}
import { IUser } from "../interfaces/user.interface";

export class IOrganisation {
  organisationId: string;
  name: string;
  coordinator_id: number;
  version: string;
  users_in_version: [number];
  users: Array<IUser>;
}
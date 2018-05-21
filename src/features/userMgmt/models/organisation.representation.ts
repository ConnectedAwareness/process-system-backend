import { User } from "./user.representation";

export interface IOrganisation {
  name: string;
  coordinator_id: number;
  users: [User];
  version: string;
  users_in_version: [number];
}

export class Organisation implements IOrganisation {
  readonly name: string;
  readonly coordinator_id: number;
  readonly users: [User];
  readonly version: string;
  readonly users_in_version: [number];
}
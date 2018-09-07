import { IUserInOrganisation } from "./userinorganisation.interface";

export interface IOrganisation {
  organisationId: string;
  name: string;
  version: string;
  users: IUserInOrganisation[];
}
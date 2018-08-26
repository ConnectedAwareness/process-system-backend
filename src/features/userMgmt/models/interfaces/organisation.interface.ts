import { IUserInOrganisation } from "./userinorganisation.interface";

export class IOrganisation {
  organisationId: string;
  name: string;
  version: string;
  users: IUserInOrganisation[];
}
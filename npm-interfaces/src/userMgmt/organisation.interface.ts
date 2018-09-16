import { IUserInOrganisation } from "./userinorganisation.interface";

/** interface representing the organisation */
export interface IOrganisation {
  /** id of the organisation */
  organisationId: string;
  /** name of the organisation */
  name: string;
  /** latest version of the process document the organisation is using */
  version: string;
  /** list of users assigned to this organisation */
  users: IUserInOrganisation[];
}
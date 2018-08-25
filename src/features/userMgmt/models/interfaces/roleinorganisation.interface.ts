import { UserRole } from "./user.interface";
import { IOrganisation } from "./organisation.interface";

export class IRoleInOrganisation {
  userAlias: string; // redundance: copied to IRoleOfUser
  userRoles: UserRole[]; // redundance: copied to IRoleOfUser
  organisation: IOrganisation;
}
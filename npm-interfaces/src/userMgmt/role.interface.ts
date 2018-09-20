import { UserRole, IUser } from "./user.interface";
import { IOrganisation } from "./organisation.interface";

/** interface for the connection of organisation and user with assigned set of role for this reference */
export interface IRole {
  /** organisation the user is assigned to */
  organisation: IOrganisation;
  /** user object */
  user: IUser;
  /** user alias valid for this organisation scope */
  userAlias: string;
  /** assigned roles of this user for the assigned organisation */
  userRoles: UserRole[];
}
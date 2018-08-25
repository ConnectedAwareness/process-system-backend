import { UserRole, IUser } from "./user.interface";

export class IRoleOfUser {
  user: IUser;
  userAlias: string; // redundance: copied from IRoleInOrganisation
  userRoles: UserRole[]; // redundance: copied from IRoleInOrganisation
}
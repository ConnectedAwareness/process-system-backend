import { UserRole, IUser } from "./user.interface";
import { IOrganisation } from "./organisation.interface";

export class IUserInOrganisation {
  organisation: IOrganisation;
  user: IUser;
  userAlias: string;
  roles: UserRole[];
}
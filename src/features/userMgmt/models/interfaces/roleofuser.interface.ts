import { UserRole } from "./user.interface";

export class IRoleOfUser {
  localUserAlias: string;
  roles: UserRole[];
  userId: string;
  userEmail: string;
}
import { UserRole } from "./user.interface";

export class IRoleOfUser {
  userId: string;
  userEmail: string;
  userAlias: string;
  userRoles: UserRole[];
}
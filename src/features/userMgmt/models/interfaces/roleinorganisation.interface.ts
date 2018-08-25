import { UserRole } from "./user.interface";

export class IRoleInOrganisation {
  userAlias: string;
  userRoles: UserRole[];
  organisationId: string;
  organisationName: string;
}
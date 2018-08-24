import { UserRole } from "./user.interface";

export class IRoleInOrganisation {
  localUserAlias: string;
  roles: UserRole[];
  organisationId: string;
  organisationName: string;
}
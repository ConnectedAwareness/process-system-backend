export interface IJwtPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  rolesInOrganisations: IRolesInOrganisation[];
  capabilities: string[];
}

export class IRolesInOrganisation {
  userAlias: string; // redundance: copied to IRoleOfUser
  userRoles: string[]; // redundance: copied to IRoleOfUser
  organisationName: string;
}
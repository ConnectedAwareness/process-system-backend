export interface IToken {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  rolesInOrganisations: IRolesInOrganisation[];
  capabilities: string[];
}

export class IRolesInOrganisation {
  userAlias: string;
  userRoles: string[];
  organisationId: string;
}
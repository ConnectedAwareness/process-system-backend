
class ImportOrganisation {
    name: string;
    version: string;
}

class ImportRolesInOrganisation {
    roles: string[];
    alias: string;
    organisationName: string;
}

class ImportUser {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    capabilities: string[];
    rolesInOrganisations: ImportRolesInOrganisation[];
}

export class ImportData {
    organisations: ImportOrganisation[];
    users: ImportUser[];
}
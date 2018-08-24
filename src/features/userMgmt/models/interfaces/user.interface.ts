import { IRoleInOrganisation } from "./roleinorganisation.interface";

export enum UserRole {
    Connectee = 'Connectee',
    ProcessCoordinator = 'ProcessCoordinator'
}

export enum UserCapability {
    Connector = 'Connector',
    ITAdmin = 'ITAdmin',
    AwarenessIntegrator = 'AwarenessIntegrator',
    ProcessCoordinator = 'ProcessCoordinator'
}

export interface IUser {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    capabilities: UserCapability[];
    rolesInOrganisations: IRoleInOrganisation[];
}
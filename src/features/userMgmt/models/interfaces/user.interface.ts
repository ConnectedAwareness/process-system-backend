import { IUserInOrganisation } from "./userinorganisation.interface";

export enum UserRole {
    Connectee = 'Connectee',
    Connector = 'Connector',
    ProcessCoordinator = 'ProcessCoordinator'
}

export enum UserCapability {
    Connector = 'Connector',
    ITAdmin = 'ITAdmin',
    AwarenessIntegrator = 'AwarenessIntegrator',
    // ProcessCoordinator = 'ProcessCoordinator'
}

export interface IUser {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    capabilities: UserCapability[];
    rolesInOrganisations: IUserInOrganisation[];
}
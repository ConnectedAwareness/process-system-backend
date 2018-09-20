import { IRole } from "./role.interface";

/** defined roles a user can have in one organisation */
export enum UserRole {
    /** role Connectee: normal member of the assigned organisation */
    Connectee = 'Connectee',
    /** role Connector: user leading the process with the assigned organisation */
    Connector = 'Connector',
    /** role ProcessCoordinator: member of the assigned organisation coordinating the process */
    ProcessCoordinator = 'ProcessCoordinator'
}

/** defined capabilities (system-wide roles) a user can have in the process system */
export enum UserCapability {
    /** capability Connector: user is part of the Connector Teams for leading organisations through the process */
    Connector = 'Connector',
    /** capability ITAdmin: user with system-wide administrative rights */
    ITAdmin = 'ITAdmin',
    /** capability AwarenessIntegrator: user with priviledges for creating and changing process document versions */
    AwarenessIntegrator = 'AwarenessIntegrator',
    // ProcessCoordinator = 'ProcessCoordinator'
}

/** interface representing the user of the process system */
export interface IUser {
    /** id of the user */
    userId: string;
    /** email address of the user */
    email: string;
    /** first name of the user */
    firstName: string;
    /** last name of the user */
    lastName: string;
    /** list of capabilities that are assigned to the user */
    capabilities: UserCapability[];
    /** list of organisations the user is assigned with the roles depending on each organisation */
    rolesInOrganisations: IRole[];
}
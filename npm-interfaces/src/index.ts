/**
 * Main module of proccess-system-interfaces.
 * Exports types, enumerations, interfaces and common methods to implement objects to send to the process system frontend.
 */

export { IElement } from "./processDoc/element.interface";
export { ElementType } from "./processDoc/elementtype.enum";
export { IElementVersion } from "./processDoc/elementversion.interface";
export { INode } from "./processDoc/node.interface";
export { INodeContainer } from "./processDoc/nodecontainer.interface";
export { IVersion } from "./processDoc/version.interface";
export { IOrganisation } from "./userMgmt/organisation.interface";
export { IUser, UserCapability, UserRole } from "./userMgmt/user.interface";
export { IUserInOrganisation } from "./userMgmt/userinorganisation.interface";

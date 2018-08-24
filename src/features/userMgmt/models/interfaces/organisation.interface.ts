import { IRoleOfUser } from "./roleofuser.interface";

export class IOrganisation {
  organisationId: string;
  name: string;
  version: string;
  rolesOfUsers: IRoleOfUser[];
}
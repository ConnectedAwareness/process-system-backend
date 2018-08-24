import { ApiModelProperty } from '@nestjs/swagger';

import { IOrganisation } from '../interfaces/organisation.interface';
import { RoleOfUserDto } from './roleofuser.dto';
import { IRoleOfUser } from '../interfaces/roleofuser.interface';

export class OrganisationDto implements IOrganisation {
  constructor() {
    this.organisationId = null;
    this.name = null;
    this.version = null;
    this.rolesOfUsers = new Array<IRoleOfUser>();
  }

  @ApiModelProperty({type: String, required: false })
  readonly organisationId: string;
  @ApiModelProperty({ type: String, required: true })
  readonly name: string;
  @ApiModelProperty({ type: String, required: false })
  readonly version: string;
  @ApiModelProperty({ type: RoleOfUserDto, isArray: true, required: false })
  readonly rolesOfUsers: IRoleOfUser[];
}
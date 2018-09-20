import { ApiModelProperty } from '@nestjs/swagger';

import { IOrganisation } from '../../../../../npm-interfaces/src/userMgmt/organisation.interface';
import { IRole } from '../../../../../npm-interfaces/src/userMgmt/role.interface';
import { RoleDto } from './role.dto';

export class OrganisationDto implements IOrganisation {
  constructor() {
    this.organisationId = null;
    this.name = null;
    this.version = null;
    this.users = new Array<IRole>();
  }

  @ApiModelProperty({type: String, required: false })
  organisationId: string;
  @ApiModelProperty({ type: String, required: true })
  name: string;
  @ApiModelProperty({ type: String, required: false })
  version: string;
  @ApiModelProperty({ type: RoleDto, isArray: true, required: false })
  users: IRole[];
}
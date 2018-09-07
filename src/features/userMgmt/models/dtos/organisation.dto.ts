import { ApiModelProperty } from '@nestjs/swagger';

import { IOrganisation } from '../interfaces/organisation.interface';
import { IUserInOrganisation } from '../interfaces/userinorganisation.interface';
import { UserInOrganisationDto } from './userinorganisation.dto';

export class OrganisationDto implements IOrganisation {
  constructor() {
    this.organisationId = null;
    this.name = null;
    this.version = null;
    this.users = new Array<IUserInOrganisation>();
  }

  @ApiModelProperty({type: String, required: false })
  organisationId: string;
  @ApiModelProperty({ type: String, required: true })
  name: string;
  @ApiModelProperty({ type: String, required: false })
  version: string;
  @ApiModelProperty({ type: UserInOrganisationDto, isArray: true, required: false })
  users: IUserInOrganisation[];
}
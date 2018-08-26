import { ApiModelProperty } from '@nestjs/swagger';

import { IOrganisation } from '../interfaces/organisation.interface';
import { UserInOrganisationDto } from './userinorganisation.dto';
import { IUserInOrganisation } from '../interfaces/userinorganisation.interface';

export class OrganisationDto implements IOrganisation {
  constructor() {
    this.organisationId = null;
    this.name = null;
    this.version = null;
    this.users = new Array<IUserInOrganisation>();
  }

  @ApiModelProperty({type: String, required: false })
  readonly organisationId: string;
  @ApiModelProperty({ type: String, required: true })
  readonly name: string;
  @ApiModelProperty({ type: String, required: false })
  readonly version: string;
  @ApiModelProperty({ type: UserInOrganisationDto, isArray: true, required: false })
  readonly users: IUserInOrganisation[];
}
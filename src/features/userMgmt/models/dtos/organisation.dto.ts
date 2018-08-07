import { ApiModelProperty } from '@nestjs/swagger';

import { UserDto } from "./user.dto";
import { IOrganisation } from '../interfaces/organisation.interface';

export class OrganisationDto implements IOrganisation {
  constructor() {
    this.organisationId = null;
    this.name = null;
    this.coordinator_id = null;
    this.version = null;
    this.users_in_version = null;
    this.users = new Array<UserDto>();
  }

  @ApiModelProperty({type: String, required: false })
  organisationId: string;
  @ApiModelProperty({ type: String, required: true })
  name: string;
  @ApiModelProperty({ type: Number, required: false })
  coordinator_id: number;
  @ApiModelProperty({ type: String, required: false })
  version: string;
  @ApiModelProperty({ type: [Number], required: false })
  users_in_version: [number];
  @ApiModelProperty({ type: UserDto, isArray: true, required: false })
  users: Array<UserDto>;
}
import { ApiModelProperty } from '@nestjs/swagger';

import { UserDto } from "./user.dto";

export class OrganisationDto {
  constructor() {
    this.organisationId = null;
    this.name = null;
    this.coordinator_id = null;
    this.version = null;
    this.users_in_version = null;
    this.users = new Array<UserDto>();
  }

  @ApiModelProperty({type: String, required: false })
  readonly organisationId: string;
  @ApiModelProperty({ type: String, required: true })
  readonly name: string;
  @ApiModelProperty({ type: Number, required: false })
  readonly coordinator_id: number;
  @ApiModelProperty({ type: String, required: false })
  readonly version: string;
  @ApiModelProperty({ type: [Number], required: false })
  readonly users_in_version: [number];
  @ApiModelProperty({ type: UserDto, isArray: true, required: false })
  readonly users: Array<UserDto>;
}
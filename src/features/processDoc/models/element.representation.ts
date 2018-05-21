import { ApiModelProperty } from '@nestjs/swagger';

import { IOrg, Org } from './org.representation';

export interface IElement {
    type: string;
    elements: Array<IElement>;
    organisations: Array<IOrg>;
}

export class Element implements IElement {
  constructor() {
    this.type = null;
    this.elements = new Array<IElement>();
    this.organisations = new Array<IOrg>();
  }

  @ApiModelProperty({type: String, required: true})
  readonly type: string;
  @ApiModelProperty({type: Object, isArray: true, required: false })
  readonly elements: Array<IElement>;
  @ApiModelProperty({type: Object, isArray: true, required: false })
  readonly organisations: Array<IOrg>;
}
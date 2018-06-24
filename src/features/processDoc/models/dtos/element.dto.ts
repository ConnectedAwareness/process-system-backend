import { ApiModelProperty } from '@nestjs/swagger';

import { OrgDto } from './org.dto';
import { ElementType } from '../interfaces/element.interface';

export class ElementDto {
  constructor() {
    this.type = null;
    this.elementId = null;
    this.text = null;
    this.elements = new Array<ElementDto>();
    this.organisations = new Array<OrgDto>();
  }

  @ApiModelProperty({type: ElementType, required: true})
  public type: ElementType;
  @ApiModelProperty({type: String, required: false})
  public elementId: string;
  @ApiModelProperty({type: String, required: false})
  public text: string;
  @ApiModelProperty({type: Object, isArray: true, required: false })
  public elements: Array<ElementDto>;
  @ApiModelProperty({type: OrgDto, isArray: true, required: false })
  public organisations: Array<OrgDto>;
}
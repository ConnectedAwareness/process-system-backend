import { ApiModelProperty } from '@nestjs/swagger';

import { IOrg, Org } from './org.representation';

export enum ElementType {
  Text = "Text",
  Header = "Header",
  Particle = "Particle",
  Explanation = "Explanation",
  Example = "Example",
  Definition = "Definition",
  Unknown = "Unknown"
}

export interface IElement {
    type: ElementType;
    elementId: string;
    text: string;
    elements: Array<IElement>;
    organisations: Array<IOrg>;
}

export class Element implements IElement {
  constructor() {
    this.type = null;
    this.elementId = null;
    this.text = null;
    this.elements = new Array<IElement>();
    this.organisations = new Array<IOrg>();
  }

  @ApiModelProperty({type: ElementType, required: true})
  public type: ElementType;
  @ApiModelProperty({type: String, required: false})
  public elementId: string;
  @ApiModelProperty({type: String, required: false})
  public text: string;
  @ApiModelProperty({type: Object, isArray: true, required: false })
  public elements: Array<IElement>;
  @ApiModelProperty({type: Object, isArray: true, required: false })
  public organisations: Array<IOrg>;
}
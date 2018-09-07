import { ApiModelProperty } from '@nestjs/swagger';

import { IElementVersion } from '../interfaces/elementversion.interface';
import { ElementDto } from './element.dto';
import { IElement } from '../interfaces/element.interface';

export class ElementVersionDto implements IElementVersion {
  constructor() {
    this.element = null;
    this.order = null;
    this.text = null;
  }

  @ApiModelProperty({type: ElementDto, required: false})
  public element: IElement;
  @ApiModelProperty({type: Number, required: false})
  public order: number;
  @ApiModelProperty({type: String, required: false})
  public text: string;
}
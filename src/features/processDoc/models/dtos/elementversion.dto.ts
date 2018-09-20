import { ApiModelProperty } from '@nestjs/swagger';

import { IElementVersion } from '../../../../../npm-interfaces/src/processDoc/elementversion.interface';
import { ElementDto } from './element.dto';
import { IElement } from '../../../../../npm-interfaces/src/processDoc/element.interface';

export class ElementVersionDto implements IElementVersion {
  constructor() {
    this.elementVersionId = null;
    this.element = null;
    this.order = null;
    this.text = null;
  }

  @ApiModelProperty({type: String, required: false})
  public elementVersionId: string;
  @ApiModelProperty({type: ElementDto, required: false})
  public element: IElement;
  @ApiModelProperty({type: Number, required: false})
  public order: number;
  @ApiModelProperty({type: String, required: false})
  public text: string;
}
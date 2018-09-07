import { ApiModelProperty } from '@nestjs/swagger';

import { IElement } from '../interfaces/element.interface';
import { IElementVersion } from '../interfaces/elementversion.interface';
import { ElementVersionDto } from './elementversion.dto';
import { ElementType } from '../interfaces/elementtype.enum';

export class ElementDto implements IElement {
  constructor() {
    this.elementId = null;
    this.type = null;
    this.elementVersions = new Array<IElementVersion>();
  }

  @ApiModelProperty({type: String, required: false})
  public elementId: string;
  @ApiModelProperty({type: ElementType, required: true})
  public type: ElementType;
  @ApiModelProperty({type: ElementVersionDto, isArray: true, required: false })
  public elementVersions: IElementVersion[];
}
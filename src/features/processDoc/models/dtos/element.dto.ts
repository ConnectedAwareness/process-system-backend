import { ApiModelProperty } from '@nestjs/swagger';

import { IElement } from '../../../../../npm-interfaces/src/processDoc/element.interface';
import { IElementVersion } from '../../../../../npm-interfaces/src/processDoc/elementversion.interface';
import { ElementVersionDto } from './elementversion.dto';
import { ElementType } from '../../../../../npm-interfaces/src/processDoc/elementtype.enum';

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
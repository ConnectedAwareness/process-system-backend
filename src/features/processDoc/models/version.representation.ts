import { ApiModelProperty } from '@nestjs/swagger';

import { Element, IElement } from './element.representation';

// export interface IVersion {
//     versionId: string;
//     published: boolean;
//     elements: Array<Element>;
// }

export class Version {
  constructor() {
    this.versionId = null;
    this.published = null;
    this.elements = new Array<Element>();
  }

  @ApiModelProperty({type: String, required: true})
  readonly versionId: string;
  @ApiModelProperty({type: Boolean, required: true})
  readonly published: boolean;
  @ApiModelProperty({type: Object, isArray: true, required: false })
  readonly elements: Array<Element>;
}
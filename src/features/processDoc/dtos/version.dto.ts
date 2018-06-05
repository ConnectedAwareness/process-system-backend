import { ApiModelProperty } from '@nestjs/swagger';

import { ElementDto } from './element.dto';

export class VersionDto {
  constructor() {
    this.versionId = null;
    this.published = null;
    this.elements = new Array<ElementDto>();
  }

  @ApiModelProperty({type: String, required: true})
  readonly versionId: string;
  @ApiModelProperty({type: Boolean, required: true})
  readonly published: boolean;
  @ApiModelProperty({type: Object, isArray: true, required: false })
  readonly elements: Array<ElementDto>;
}

export class ImportVersion {
  constructor() {
    this.versionId = null;
    this.elements = null;
  }

  @ApiModelProperty({type: String, required: true})
  readonly versionId: string;
  @ApiModelProperty({type: String, required: true})
  readonly elements: string;
}
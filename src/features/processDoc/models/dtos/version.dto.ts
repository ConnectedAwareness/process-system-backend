import { ApiModelProperty } from '@nestjs/swagger';

import { ElementDto } from './element.dto';

export class VersionDto {
  constructor() {
    this.versionId = null;
    this.published = null;
    this.elements = new Array<ElementDto>();
  }

  @ApiModelProperty({ type: String, required: true })
  versionId: string;
  @ApiModelProperty({ type: Boolean, required: true })
  published: boolean;
  @ApiModelProperty({ type: ElementDto, isArray: true, required: false })
  elements: Array<ElementDto>;
}

export class ImportVersion {
  constructor() {
    this.versionId = null;
    this.elements = null;
  }

  @ApiModelProperty({ type: String, required: true })
  versionId: string;
  @ApiModelProperty({ type: String, required: true })
  elements: string;
}
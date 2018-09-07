import { ApiModelProperty } from '@nestjs/swagger';

import { IVersion } from '../interfaces/version.interface';
import { INode } from '../interfaces/node.interface';
import { NodeDto } from './node.dto';

export class VersionDto implements IVersion {
  constructor() {
    this.versionId = null;
    this.published = null;
    this.nodes = new Array<INode>();
    this.linkedNodeRoot = null;
  }

  @ApiModelProperty({ type: String, required: true })
  versionId: string;
  @ApiModelProperty({ type: Boolean, required: true })
  published: boolean;
  @ApiModelProperty({ type: NodeDto, isArray: true, required: false })
  nodes: INode[];
  @ApiModelProperty({ type: Object, required: true })
  linkedNodeRoot: INode;
}
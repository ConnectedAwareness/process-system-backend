import { ApiModelProperty } from '@nestjs/swagger';

import { INode } from '../interfaces/node.interface';
import { IElementVersion } from '../interfaces/elementversion.interface';
import { ElementVersionDto } from './elementversion.dto';

export class NodeDto implements INode {
  constructor() {
    this.nodeId = null;
    this.elementVersion = null;
    this.nodes = new Array<INode>();
  }

  @ApiModelProperty({ type: String, required: false })
  nodeId: string;
  @ApiModelProperty({ type: ElementVersionDto, required: true })
  elementVersion: IElementVersion;
  @ApiModelProperty({ type: Object, isArray: true, required: false })
  // NOTE we'll use NodeDto if we don't embed the node tree, but denormalize them in a specific collection
  // e.g. for "version editing" mode
  // see http://confluence.connectedawareness.org/display/PROSYS/Besprechung+ProzDok+-+Konzept+Datenmodell
  // see node.schema.ts, version.schema.ts
  // @ApiModelProperty({ type: NodeDto, isArray: true, required: false })
  nodes: INode[];
}
import { INodeContainer } from "./nodecontainer.interface";
import { IElementVersion } from "./elementversion.interface";

export interface INode extends INodeContainer {
    nodeId: string; // will only be used by LinkedNodes, is null for TreeNodes
    elementVersion: IElementVersion;
}
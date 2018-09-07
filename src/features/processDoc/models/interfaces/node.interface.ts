import { INodeContainer } from "./nodecontainer.interface";
import { IElementVersion } from "./elementversion.interface";

export interface INode extends INodeContainer {
    elementVersion: IElementVersion;
}
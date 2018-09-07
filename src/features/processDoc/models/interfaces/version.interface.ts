import { INodeContainer } from "./nodecontainer.interface";
import { INode } from "./node.interface";

export interface IVersion extends INodeContainer {
    versionId: string;
    published: boolean;
    linkedNodeRoot: INode;
}
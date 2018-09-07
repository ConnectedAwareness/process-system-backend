import { INodeContainer } from "./nodecontainer.interface";

export interface IVersion extends INodeContainer {
    versionId: string;
    published: boolean;
}
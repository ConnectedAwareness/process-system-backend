import { IElement } from "./element.interface";

export interface IElementVersion {
    // will likely only be used by LinkedNodes, may be null for TreeNodes (TODO design decision)
    // is "required" in schema anyway
    elementVersionId: string;
    element: IElement;
    order: number;
    text: string;
}
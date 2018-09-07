import { IElement } from "./element.interface";

export interface IElementVersion {
    readonly element: IElement;
    order: number;
    readonly text: string;
}
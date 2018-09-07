import { IElementVersion } from "./elementversion.interface";
import { ElementType } from "./elementtype.enum";

export interface IElement {
    elementId: string;
    type: ElementType;
    elementVersions: IElementVersion[];
}
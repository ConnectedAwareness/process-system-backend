import { Document } from 'mongoose';

import { IOrg } from './org.interface';

export enum ElementType {
  Text = "Text",
  Header = "Header",
  Particle = "Particle",
  Explanation = "Explanation",
  Example = "Example",
  Definition = "Definition",
  Unknown = "Unknown"
}

export interface IElement extends Document {
    readonly type: ElementType;
    readonly elementId: string;
    readonly text: string;
    readonly elements: Array<IElement>;
    readonly organisations: Array<IOrg>;
}
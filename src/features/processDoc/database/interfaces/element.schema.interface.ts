import { Document } from 'mongoose';

import { IOrgSchema } from './org.schema.interface';

export enum ElementType {
  Text = "Text",
  Header = "Header",
  Particle = "Particle",
  Explanation = "Explanation",
  Example = "Example",
  Definition = "Definition",
  Unknown = "Unknown"
}

export interface IElementSchema extends Document {
    readonly type: ElementType;
    readonly elementId: string;
    readonly text: string;
    readonly elements: Array<IElementSchema>;
    readonly organisations: Array<IOrgSchema>;
}
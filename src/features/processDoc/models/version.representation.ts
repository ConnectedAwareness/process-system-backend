import * as mongoose from 'mongoose';

import {ElementSchema, Element, IElement } from './element.representation';

export interface IVersion {
    published: boolean;
    elements: [Element];
}

export class Version implements IVersion {
  readonly published: boolean;
  readonly elements: [Element];
}

export const VersionSchema = new mongoose.Schema({
    published: { type: Boolean, required: true },
    elements: [ElementSchema],
});

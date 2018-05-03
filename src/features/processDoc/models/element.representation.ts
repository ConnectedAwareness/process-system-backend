import * as mongoose from 'mongoose';

import { OrganisationSchema, IOrganisation, Organisation } from './organisation.representation';

export interface IElement {
    type: string;
    elements: [IElement];
    organisations: [IOrganisation];
}

export class Element implements IElement {
  readonly type: string;
  readonly elements: [IElement];
  readonly organisations: [IOrganisation];
}

const ElementSchemaX = new mongoose.Schema();
ElementSchemaX.add({
    type: { type: String, required: true },
    elements: [ElementSchemaX],
    organisations: [OrganisationSchema],
});

export const ElementSchema = ElementSchemaX;

import * as mongoose from 'mongoose';

import { OrgSchema } from './org.schema';

export const ElementSchemaX = new mongoose.Schema();
ElementSchemaX.add({
    type: { type: String, required: true },
    elements: [ElementSchemaX],
    organisations: [OrgSchema],
}, {collection: 'elements'});

export const ElementSchema = ElementSchemaX;

// export const VersionSchemaFeature = { name: 'Element', schema: ElementSchema };
import * as mongoose from 'mongoose';

import { OrgSchema } from './org.schema';

export const ElementSchema = new mongoose.Schema({
    type: { type: String, required: true },
    organisations: [OrgSchema],
}, {collection: 'elements'});

ElementSchema.add({
  elements: [ElementSchema]
});

// export const VersionSchemaFeature = { name: 'Element', schema: ElementSchema };
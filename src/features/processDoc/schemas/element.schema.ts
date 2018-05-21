import * as mongoose from 'mongoose';

import { OrgSchema } from './org.schema';

// const ElementSchema = new mongoose.Schema();
// ElementSchema.add({
//     type: { type: String, required: true },
//     elements: [ElementSchema],
//     organisations: [OrgSchema],
// });

const ElementSchemaX = new mongoose.Schema();
ElementSchemaX.add({
    type: { type: String, required: true },
    elements: [ElementSchemaX],
    organisations: [OrgSchema],
});

export const ElementSchema = ElementSchemaX;
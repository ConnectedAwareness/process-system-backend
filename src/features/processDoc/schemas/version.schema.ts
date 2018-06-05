import * as mongoose from 'mongoose';

import {ElementSchema } from './element.schema';

export const VersionSchema = new mongoose.Schema({
    versionId: { type: String, required: true },
    published: { type: Boolean, required: true },
    elements: [ElementSchema],
}
, {collection: 'versions' }
);

// export const VersionSchemaFeature = { name: 'Version', schema: VersionSchema };
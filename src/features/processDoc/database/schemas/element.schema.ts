import * as mongoose from 'mongoose';

export const ElementSchema = new mongoose.Schema({
    elementId: { type: String, required: false },
    type: { type: String, required: true },
    elementVersions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ElementVersion' }]
}, {collection: 'elements'});

ElementSchema.index({ elementId: -1 }, { unique: true } );
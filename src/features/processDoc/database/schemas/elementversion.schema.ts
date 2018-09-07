import * as mongoose from 'mongoose';

export const ElementVersionSchema = new mongoose.Schema({
    elementVersionId: { type: String, required: true },
    element: { type: mongoose.Schema.Types.ObjectId, ref: 'Element' },
    order: { type: Number, required: false },
    text: { type: String, required: true },
}, {collection: 'elementversions'});

ElementVersionSchema.index({ elementVersionId: -1 }, { unique: true } );
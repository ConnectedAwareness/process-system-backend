import * as mongoose from 'mongoose';

export const ElementVersionSchema = new mongoose.Schema({
    element: { type: mongoose.Schema.Types.ObjectId, ref: 'Element' },
    order: { type: Number, required: false },
    text: { type: String, required: true },
}, {collection: 'elementversions'});

// TODO is this necessary and useful?
ElementVersionSchema.index({ element: -1 }, { unique: true } );
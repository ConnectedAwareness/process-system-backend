import * as mongoose from 'mongoose';
import { SchemaTypeNames } from '../../../../common/util/constants';

export const ElementVersionSchema = new mongoose.Schema({
    elementVersionId: { type: String, required: true },
    element: { type: mongoose.Schema.Types.ObjectId, ref: SchemaTypeNames.Element },
    order: { type: Number, required: false },
    text: { type: String, required: true },
}, {collection: 'elementversions'});

ElementVersionSchema.index({ elementVersionId: -1 }, { unique: true } );
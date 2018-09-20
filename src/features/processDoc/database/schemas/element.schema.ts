import * as mongoose from 'mongoose';
import { SchemaTypeNames } from '../../../../common/util/constants';

export const ElementSchema = new mongoose.Schema({
    elementId: { type: String, required: false },
    type: { type: String, required: true },
    elementVersions: [{ type: mongoose.Schema.Types.ObjectId, ref: SchemaTypeNames.ElementVersion }]
}, {collection: 'elements'});

ElementSchema.index({ elementId: -1 }, { unique: true } );
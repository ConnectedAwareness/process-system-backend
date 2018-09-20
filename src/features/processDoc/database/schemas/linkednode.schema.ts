import * as mongoose from 'mongoose';
import { SchemaTypeNames } from '../../../../common/util/constants';

export const LinkedNodeSchema = new mongoose.Schema({
    nodeId: { type: String, required: false },
    elementVersion: { type: mongoose.Schema.Types.ObjectId, ref: SchemaTypeNames.ElementVersion },
    nodes: [{ type: mongoose.Schema.Types.ObjectId, ref: SchemaTypeNames.LinkedNode }]
}
, {collection: 'linkednodes' }
);

LinkedNodeSchema.index({ nodeId: -1 }, { unique: true } );
import * as mongoose from 'mongoose';

export const LinkedNodeSchema = new mongoose.Schema({
    nodeId: { type: String, required: false },
    elementVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'ElementVersion' },
    nodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LinkedNode' }]
}
, {collection: 'linkednodes' }
);

LinkedNodeSchema.index({ nodeId: -1 }, { unique: true } );
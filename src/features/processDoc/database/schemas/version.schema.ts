import * as mongoose from 'mongoose';
import { TreeNodeSchema } from './treenode.schema';
import { LinkedNodeSchema } from './linkednode.schema';

export const VersionSchema = new mongoose.Schema({
    versionId: { type: String, required: true },
    published: { type: Boolean, required: true },
    nodes: [TreeNodeSchema],
    linkedNodeRoot: { type: mongoose.Schema.Types.ObjectId, ref: 'LinkedNode' }
}
, {collection: 'versions' }
);

VersionSchema.index({ versionId: -1 }, { unique: true } );
import * as mongoose from 'mongoose';
import { NodeSchema } from './node.schema';

export const VersionSchema = new mongoose.Schema({
    versionId: { type: String, required: true },
    published: { type: Boolean, required: true },
    nodes: [NodeSchema]
    // NOTE we'll use ref if we don't embed the node tree, but denormalize them in a specific collection
    // e.g. for "version editing" mode
    // see http://confluence.connectedawareness.org/display/PROSYS/Besprechung+ProzDok+-+Konzept+Datenmodell
    // see node.schema.ts, node.dto.ts
    // nodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Node' }]
}
, {collection: 'versions' }
);

VersionSchema.index({ versionId: -1 }, { unique: true } );
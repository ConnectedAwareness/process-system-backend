import * as mongoose from 'mongoose';

export const TreeNodeSchema = new mongoose.Schema({
    elementVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'ElementVersion' }
});
TreeNodeSchema.add({
    nodes: [TreeNodeSchema]
});

// NOTE we'll use ref if we don't embed the node tree, but denormalize them in a specific collection
// e.g. for "version editing" mode
// see http://confluence.connectedawareness.org/display/PROSYS/Besprechung+ProzDok+-+Konzept+Datenmodell
// see version.schema.ts, node.dto.ts
// NodeSchema.add({
//     nodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Node' }]
// });
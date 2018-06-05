import * as mongoose from 'mongoose';

import { CommentSchema } from './comment.schema';

export const OrgSchema = new mongoose.Schema({
    organisationid: {type: String, required: true},
    comments: [CommentSchema],
}, {collection: 'orgs'});

// export const VersionSchemaFeature = { name: 'Org', schema: OrgSchema };
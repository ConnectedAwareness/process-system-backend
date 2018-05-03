import * as mongoose from 'mongoose';
import { CommentSchema, IComment, Comment } from './comment.representation';

export interface IOrganisation {
    organisationid: string;
    comments: [IComment];
}

export class Organisation implements IOrganisation {
  readonly organisationid: string;
  readonly comments: [IComment];
}

export const OrganisationSchema = new mongoose.Schema({
    organisationid: {type: String, required: true},
    comments: [CommentSchema],
});

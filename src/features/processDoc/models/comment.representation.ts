import * as mongoose from 'mongoose';

export interface IComment {
    userid: string;
    comment: string;
    vote: number;
}

export class Comment implements IComment {
  readonly userid: string;
  readonly comment: string;
  readonly vote: number;
}

export const CommentSchema = new mongoose.Schema({
    userid: {type: mongoose.Schema.Types.ObjectId, required: true},
    comment: String,
    vote: {type: Number, required: true},
});
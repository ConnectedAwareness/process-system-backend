import { Document } from 'mongoose';

export interface ICommentSchema extends Document {
  readonly userid: string;
  readonly comment: string;
  readonly vote: number;
}
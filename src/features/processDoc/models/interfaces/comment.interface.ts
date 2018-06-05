import { Document } from 'mongoose';

export interface IComment extends Document {
  readonly userid: string;
  readonly comment: string;
  readonly vote: number;
}
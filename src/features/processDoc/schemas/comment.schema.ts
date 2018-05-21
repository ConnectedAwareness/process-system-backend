import * as mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema({
    userid: {type: mongoose.Schema.Types.ObjectId, required: true},
    comment: String,
    vote: {type: Number, required: true},
});
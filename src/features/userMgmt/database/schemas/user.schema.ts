import { Schema } from 'mongoose';

export const UserSchema = new Schema({
    userId: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    alias: { type: String, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    roles: { type: [String], required: false },
    organisation: { type: Schema.Types.ObjectId, ref: 'Organisation' }
}
, {collection: 'users' }
);

UserSchema.index({ email: -1 }, { unique: true } );
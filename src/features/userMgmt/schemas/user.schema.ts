import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    alias: { type: String, required: false },
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    token: { type: String, required: false },
    roles: { type: [String], required: false }
}
, {collection: 'users' }
);

UserSchema.index({ email: -1 }, { unique: true } );
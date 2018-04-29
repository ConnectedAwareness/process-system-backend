import * as mongoose from 'mongoose';
export const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    alias: String,
    first_name: String,
    last_name: String,
    token: String,
    roles: [String]
});

import { Document } from 'mongoose';

export interface IUser extends Document {
    userId: string;
    email: string;
    password: string;
    alias: string;
    first_name: string;
    last_name: string;
    token: string;
    roles: [string];
}
import { Document } from 'mongoose';

export interface IUser extends Document {
    readonly email: string;
    readonly password: string;
    readonly alias: string;
    readonly first_name: string;
    readonly last_name: string;
    readonly token: string;
    readonly roles: [string];
}
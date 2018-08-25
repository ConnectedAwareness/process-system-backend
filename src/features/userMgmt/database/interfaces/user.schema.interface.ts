import { Document, Schema } from 'mongoose';
import { IUser } from '../../models/interfaces/user.interface';

export interface IUserSchema extends Document, IUser {
    password: string;
}
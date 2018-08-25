import { Document, Schema } from 'mongoose';
import { IRoleOfUser } from '../../models/interfaces/roleofuser.interface';
import { IUserSchema } from './user.schema.interface';

export interface IRoleOfUserSchema extends IRoleOfUser {
    user: IUserSchema;
}
import { Document, Schema } from 'mongoose';
import { IRoleOfUser } from '../../models/interfaces/roleofuser.interface';

export interface IRoleOfUserSchema extends Document, IRoleOfUser {
    _userId: Schema.Types.ObjectId;
}
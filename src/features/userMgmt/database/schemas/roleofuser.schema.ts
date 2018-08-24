import { Schema } from 'mongoose';
import { UserRole } from '../../models/interfaces/user.interface';

export const RoleOfUserSchema = new Schema({
    localUserAlias: { type: String, required: false },
    roles: { type: [String], required: true, enum: [ UserRole.Connectee, UserRole.ProcessCoordinator ]},
    _userId: { type: Schema.Types.ObjectId, ref: 'User' },
    userId: { type: String, required: true },
    userEmail: { type: String, required: true }
});
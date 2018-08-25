import { Schema } from 'mongoose';
import { UserRole } from '../../models/interfaces/user.interface';

export const RoleOfUserSchema = new Schema({
    _userId: { type: Schema.Types.ObjectId, ref: 'User' },
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    userAlias: { type: String, required: false },
    userRoles: { type: [String], required: true, enum: [ UserRole.Connectee, UserRole.ProcessCoordinator ]}
});
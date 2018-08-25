import { Schema } from 'mongoose';
import { UserRole } from '../../models/interfaces/user.interface';

export const RoleOfUserSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    userAlias: { type: String, required: false },
    userRoles: { type: [String], required: true, enum: [ UserRole.Connectee, UserRole.Connector, UserRole.ProcessCoordinator ]}
});
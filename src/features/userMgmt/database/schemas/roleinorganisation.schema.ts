import { Schema } from 'mongoose';
import { UserRole } from '../../models/interfaces/user.interface';

export const RoleInOrganisationSchema = new Schema({
    userAlias: { type: String, required: false },
    userRoles: { type: [String], required: true, enum: [ UserRole.Connectee, UserRole.Connector, UserRole.ProcessCoordinator ]},
    organisation: { type: Schema.Types.ObjectId, ref: 'Organisation' },
});
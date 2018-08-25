import { Schema } from 'mongoose';
import { UserRole } from '../../models/interfaces/user.interface';

export const RoleInOrganisationSchema = new Schema({
    userAlias: { type: String, required: false },
    userRoles: { type: [String], required: true, enum: [ UserRole.Connectee, UserRole.ProcessCoordinator ]},
    _organisationId: { type: Schema.Types.ObjectId, ref: 'Organisation' },
    organisationId: { type: String, required: true },
    organisationName: { type: String, required: true }
});
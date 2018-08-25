import { Schema } from 'mongoose';
import { UserCapability } from '../../models/interfaces/user.interface';
import { RoleInOrganisationSchema } from './roleinorganisation.schema';

export const UserSchema = new Schema({
    userId: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    capabilities: { type: [String], required: false, enum: [ UserCapability.Connector, UserCapability.ITAdmin,
        // UserCapability.ProcessCoordinator,
        UserCapability.AwarenessIntegrator ] },
    rolesInOrganisations: { type: [RoleInOrganisationSchema], required: false }
}
, {collection: 'users' }
);

UserSchema.index({ email: -1 }, { unique: true } );
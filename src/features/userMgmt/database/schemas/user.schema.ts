import { Schema } from 'mongoose';
import { UserCapability } from '../../../../../npm-interfaces/src/userMgmt/user.interface';
import { SchemaTypeNames } from '../../../../common/util/constants';

export const UserSchema = new Schema({
    userId: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    capabilities: { type: [String], required: false, enum: [ UserCapability.Connector, UserCapability.ITAdmin,
        // UserCapability.ProcessCoordinator,
        UserCapability.AwarenessIntegrator ] },
    rolesInOrganisations: [{ type: Schema.Types.ObjectId, ref: SchemaTypeNames.UserInOrganisation }]
}
, {collection: 'users' }
);

UserSchema.index({ email: -1 }, { unique: true } );
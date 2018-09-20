import { Schema } from 'mongoose';
import { UserRole } from '../../../../../npm-interfaces/src/userMgmt/user.interface';

export const UserInOrganisationSchema = new Schema({
    organisation: { type: Schema.Types.ObjectId, ref: 'Organisation' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    userAlias: { type: String, required: false },
    roles: { type: [String], required: true, enum: [ UserRole.Connectee, UserRole.Connector, UserRole.ProcessCoordinator ]}
});
import { Schema } from 'mongoose';
import { UserRole } from '../../../../../npm-interfaces/src/userMgmt/user.interface';
import { SchemaTypeNames } from '../../../../common/util/constants';

export const RoleSchema = new Schema({
    organisation: { type: Schema.Types.ObjectId, ref: SchemaTypeNames.Organisation },
    user: { type: Schema.Types.ObjectId, ref: SchemaTypeNames.User },
    userAlias: { type: String, required: false },
    userRoles: { type: [String], required: true, enum: [ UserRole.Connectee, UserRole.Connector, UserRole.ProcessCoordinator ]}
});
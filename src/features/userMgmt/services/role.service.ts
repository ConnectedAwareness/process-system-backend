import { Injectable, Inject, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';

import { Model } from 'mongoose';

import { of } from 'rxjs';

import { IUserSchema } from '../database/interfaces/user.schema.interface';
import { UserRole } from '../models/interfaces/user.interface';
import { IUserInOrganisationSchema } from '../database/interfaces/userinorganisation.schema.interface';
import { UserInOrganisationDto } from '../models/dtos/userinorganisation.dto';
import { IOrganisationSchema } from '../database/interfaces/organisation.schema.interface';
import { IUserInOrganisation } from '../models/interfaces/userinorganisation.interface';
import { RoleFactory } from '../models/factories/role.factory';

@Injectable()
export class RoleService {
    constructor(
        @Inject('OrganisationModelToken') private readonly organisationModel: Model<IOrganisationSchema>,
        @Inject('UserModelToken') private readonly userModel: Model<IUserSchema>,
        @Inject('UserInOrganisationModelToken') private readonly roleModel: Model<IUserInOrganisationSchema>) { }

    private async checkParameterObjectAsync(uInO: UserInOrganisationDto, allowEmptyRoles: boolean):
        Promise<{ userModel: IUserSchema, organisationModel: IOrganisationSchema }> {
        if (uInO.organisationIsObject) {
            if (!uInO.organisation)
                throw new HttpException("Can't add user to organisation! No organisation provided", HttpStatus.BAD_REQUEST);
        } else
            if (!uInO.organisationId || uInO.organisationId.length === 0)
                throw new HttpException("Can't add user to organisation! No organisationId provided", HttpStatus.BAD_REQUEST);

        if (uInO.userIsObject) {
            if (!uInO.user)
                throw new HttpException("Can't add user to organisation! No user provided", HttpStatus.BAD_REQUEST);
        } else
            if (!uInO.userId || uInO.userId.length === 0)
                throw new HttpException("Can't add user to organisation! No userId provided", HttpStatus.BAD_REQUEST);

        if (!allowEmptyRoles && !uInO.roles || uInO.roles.length === 0)
            throw new HttpException("Can't add user to organisation! No roles provided", HttpStatus.BAD_REQUEST);

        const userId = uInO.userIsObject ? uInO.user.userId : uInO.userId;
        const userModel = await this.userModel.findOne({ userId: userId })
            .populate({ path: 'rolesInOrganisations', populate: [{ path: 'organisation' }, { path: 'user' }] });
        if (!userModel)
            throw new InternalServerErrorException("Could not find user to add to organisation");

        const organisationId = uInO.organisationIsObject ? uInO.organisation.organisationId : uInO.organisationId;
        const organisationModel = await this.organisationModel.findOne({ organisationId: organisationId });
        if (!organisationModel)
            throw new InternalServerErrorException("Could not find organisation to add user");

        return Promise.resolve({ userModel, organisationModel });
    }

    async addUserToOrganisationAsync(uInO: UserInOrganisationDto): Promise<IUserInOrganisation> {
        const { userModel, organisationModel } = await this.checkParameterObjectAsync(uInO, false);

        try {
            let uio = new this.roleModel(uInO);
            uio.user = userModel;
            uio.organisation = organisationModel;
            uio.roles = uInO.roles.map(r => UserRole[r]);
            uio.userAlias = uInO.userAlias;
            uio = await uio.save();

            userModel.rolesInOrganisations.push(uio);
            await userModel.save();

            organisationModel.users.push(uio);
            await organisationModel.save();

            console.log(`Successfully assigned user ${userModel.userId} with alias ${uio.userAlias}` +
                ` to organisation ${organisationModel.organisationId} using roles ${uio.roles}`);

            return of(RoleFactory.createRole(uio, uInO.userIsObject, uInO.organisationIsObject)).toPromise();
        }
        catch (ex) {
            const msg = `Error assigning user ${uInO.user}/${uInO.userId} to organisation ${uInO.organisation}/${uInO.organisationId}`;
            console.error(msg, ex);
            throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateUserInOrganisationAsync(uInO: UserInOrganisationDto): Promise<IUserInOrganisation> {
        const { userModel, organisationModel } = await this.checkParameterObjectAsync(uInO, false);

        try {
            // we need a start to find the UserInOrganisation object to remove
            const uInOModel = userModel.rolesInOrganisations
                .find(r => r.organisation.organisationId === organisationModel.organisationId) as IUserInOrganisationSchema;
            if (!uInOModel)
                throw new InternalServerErrorException("Could not find existing role to update");

            uInOModel.roles = uInO.roles.map(r => UserRole[r]);
            uInOModel.userAlias = uInO.userAlias;

            const res = await uInOModel.save().catch(err => console.error(err));
            // TODO do we need this res-testing or could this exception be raised in save().catch?
            if (!res) {
                throw new HttpException(`Could not update role for User with Email ${userModel.email}` +
                    ` to organisation ${organisationModel.organisationId}`, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            console.log(`User ${userModel.email} updated in organisation ${organisationModel.name}`);

            return of(RoleFactory.createRole(res, uInO.userIsObject, uInO.organisationIsObject)).toPromise();
        }
        catch (ex) {
            const msg = `Error updating user with Email ${userModel.email} to organisation with Id ${organisationModel.organisationId}`;
            console.error(msg, ex);
            throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async removeUserFromOrganisationAsync(uInO: UserInOrganisationDto): Promise<boolean> {
        const { userModel, organisationModel } = await this.checkParameterObjectAsync(uInO, false);

        try {
            // we need a start to find the UserInOrganisation object to remove
            const uInOModel = userModel.rolesInOrganisations
                .find(r => r.organisation.organisationId === organisationModel.organisationId) as IUserInOrganisationSchema;
            if (!uInOModel)
                throw new InternalServerErrorException("Could not find existing role to remove");

            const removedUInO = await uInOModel.remove();

            userModel.rolesInOrganisations = (userModel.rolesInOrganisations as IUserInOrganisationSchema[]).filter(r => r !== uInOModel);
            await userModel.save();

            organisationModel.users = (organisationModel.users as IUserInOrganisationSchema[]).filter(r => r !== uInOModel);
            await organisationModel.save();

            console.log(`User ${userModel.email} removed from organisation ${organisationModel.name}`);

            return Promise.resolve(true);
        }
        catch (ex) {
            const msg = `Error removing user with Email ${userModel.email} from organisation with Id ${organisationModel.organisationId}`;
            console.error(msg, ex);
            throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
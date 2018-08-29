import { Injectable, Inject, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';

import * as _ from 'lodash';

import { of } from 'rxjs';

import { IOrganisationSchema } from '../database/interfaces/organisation.schema.interface';
import { UserService } from './user.service';
import { OrganisationFactory } from '../models/factories/organisation.factory';
import { IUser, UserRole } from '../models/interfaces/user.interface';
import { IOrganisation } from '../models/interfaces/organisation.interface';
import { IUserInOrganisation } from '../models/interfaces/userinorganisation.interface';
import { OrganisationDto } from '../models/dtos/organisation.dto';
import { IUserSchema } from '../database/interfaces/user.schema.interface';
import { UserInOrganisationDto } from '../models/dtos/userinorganisation.dto';
import { UserDto } from '../models/dtos/user.dto';
import { IUserInOrganisationSchema } from '../database/interfaces/userinorganisation.schema.interface';

@Injectable()
export class OrganisationService {
    constructor(
        @Inject('OrganisationModelToken') private readonly organisationModel: Model<IOrganisationSchema>,
        @Inject('UserModelToken') private readonly userModel: Model<IUserSchema>,
        @Inject('UserInOrganisationModelToken') private readonly userInOrganisationModel: Model<IUserInOrganisationSchema>,
        private userService: UserService) { }

    async getAllOrganisationsAsync(): Promise<IOrganisation[]> {
        const res = await this.organisationModel.find();

        if (res == null)
            return null;

        return of(res.map(o => OrganisationFactory.createOrganisation(o, false))).toPromise();
    }

    async getOrganisationByIdAsync(organisationId: string): Promise<IOrganisation> {
        const query = { organisationId: organisationId };

        const res = await this.organisationModel.findOne(query)
            .populate({path : 'users', populate : {path : 'user'}});

        if (res == null)
            throw new HttpException(`Organisation with Id: ${organisationId} not found`, HttpStatus.BAD_REQUEST);

        return of(OrganisationFactory.createOrganisation(res)).toPromise();
    }

    async getOrganisationByNameAsync(name: string): Promise<IOrganisation> {
        const query = { name: name };

        const res = await this.organisationModel.findOne(query);

        if (res == null)
            return null;

        return of(OrganisationFactory.createOrganisation(res)).toPromise();
    }

    async searchOrganisationsAsync(search?: string): Promise<IOrganisation[]> {
        if (search && search.length > 0) {
            const regex = new RegExp(search, 'i');
            const res = await this.organisationModel.find().or([
                { name: { $regex: regex } }]);

            return of(res.map(t => OrganisationFactory.createOrganisation(t))).toPromise();
        }
        else
            return this.getAllOrganisationsAsync();
    }

    async createOrganisationAsync(organisation: IOrganisation): Promise<OrganisationDto> {
        try {
            if (organisation.organisationId && organisation.organisationId.length)
                throw new HttpException("Can't create new organisation, already has organisationId", HttpStatus.BAD_REQUEST);

            const model = new this.organisationModel(organisation);
            model.organisationId = OrganisationFactory.getId();

            const res = await model.save();

            console.log(`new Organisation ${model.organisationId} saved`);

            return of(OrganisationFactory.createOrganisation(res)).toPromise();

        } catch (error) {
            console.log(error);
        }
    }

    async updateOrganisationAsync(organisation: IOrganisation): Promise<boolean> {
        if (!organisation.organisationId || organisation.organisationId.length === 0)
            throw new HttpException("Can't update organisation, no organisationId supplied", HttpStatus.BAD_REQUEST);

        const query = { organisationId: organisation.organisationId };

        const model = await this.organisationModel.findOne(query);

        const res = await model.update(organisation); // TODO care for model.rolesOfUsers, e.g. "rescue" those user entries

        console.log("Organisation updated");
        console.log(res);

        return true;
    }

    async deleteOrganisationAsync(organisationId: string): Promise<boolean> {
        if (!organisationId || organisationId.length === 0)
            throw new HttpException("Can't delete organisation, no organisationId supplied", HttpStatus.BAD_REQUEST);

        const query = { organisationId: organisationId };

        const res = await this.organisationModel.findOneAndRemove(query, (err, result) => {
            if (err) {
                console.error(err);
                throw new HttpException(`Error deleting organisation with Id: ${organisationId}`,
                    HttpStatus.INTERNAL_SERVER_ERROR);
            }

            if (result)
                return Promise.resolve(true);

        });

        return Promise.resolve(false);
    }

    async addUserToOrganisationAsync(uInO: UserInOrganisationDto): Promise<boolean> {
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

        if (!uInO.roles || uInO.roles.length === 0)
            throw new HttpException("Can't add user to organisation! No roles provided", HttpStatus.BAD_REQUEST);

        try {
            const userId = uInO.userIsObject ? uInO.user.userId : uInO.userId;
            const userModel = await this.userModel.findOne({ userId: userId });
            if (!userModel)
                throw new InternalServerErrorException("Could not find user to add to organisation");

            const organisationId = uInO.organisationIsObject ? uInO.organisation.organisationId : uInO.organisationId;
            const organisationModel = await this.organisationModel.findOne({ organisationId: organisationId });
            if (!organisationModel)
                throw new InternalServerErrorException("Could not find organisation to add user");

            let uio = new this.userInOrganisationModel(uInO);
            uio.user = userModel;
            uio.organisation = organisationModel;
            uio.roles = uInO.roles.map(r => UserRole[r]);
            uio.userAlias = uInO.userAlias;
            uio = await uio.save();

            // { // NOTE no constructor, since some fields stay (purposefully) undefined
            //     organisation: organisation,
            //     user: user,
            //     userAlias: null,
            //     roles: roles
            // } as UserInOrganisationDto;

            // // first update user model
            // const rio: RoleInOrganisationDto = {
            //     userAlias: uInO.alias,
            //     userRoles: rolesTyped,
            //     organisation: organisation
            // };
            userModel.rolesInOrganisations.push(uio);
            await userModel.save();

            // // then update organisation model
            // const rou: UserInOrganisationDto = {
            //     userAlias: uInO.alias,
            //     roles: rolesTyped,
            //     user: user
            // };
            organisationModel.users.push(uio);
            await organisationModel.save();

            console.log(`Successfully assigned user ${userModel.userId} with alias ${uio.userAlias}` +
                ` to organisation ${organisationModel.organisationId} using roles ${uio.roles}`);

            return Promise.resolve(true);
        }
        catch (ex) {
            const msg = `Error assigning user ${uInO.user}/${uInO.userId} to organisation ${uInO.organisation}/${uInO.organisationId}`;
            console.error(msg, ex);
            throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // TODO this method is not proofed / reviewed since datamodel change; cf addUserToOrganisationAsync for how-to handle data structures
    async updateOrganisationWithUserAsync(organisation: IOrganisation, role: IUserInOrganisation, userToAdd: IUser): Promise<boolean> {
        if (!organisation)
            throw new HttpException(`Supplied organisation is not set`, HttpStatus.BAD_REQUEST);
        if (!role)
            throw new HttpException(`Supplied role is not set`, HttpStatus.BAD_REQUEST);
        if (!userToAdd)
            throw new HttpException(`Supplied user is not set`, HttpStatus.BAD_REQUEST);
        if (!userToAdd.email)
            throw new HttpException("User has no email address set!", HttpStatus.BAD_REQUEST);

        try {
            // update org model
            const organisationModel = await this.organisationModel.findOne({ organisationId: organisation.organisationId });

            let roleOfUser = organisation.users.find((r) => r.user.userId === userToAdd.userId);
            if (!roleOfUser) {
                roleOfUser = Object.create(UserInOrganisationDto.prototype) as IUserInOrganisation;
                roleOfUser.user = userToAdd;
                organisation.users.push(roleOfUser);
            }
            roleOfUser.roles = role.roles.map((r) => UserRole[r]);

            const res = await organisationModel.save().catch(err => console.error(err));
            // TODO do we need this res-testing or could this exception be raised in save().catch?
            if (!res) {
                throw new HttpException(`Could not add User with Email ${userToAdd.email}` +
                    ` to organisation ${organisation.organisationId}`, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            console.log(`User ${userToAdd.email} assigned for organisation ${organisation.name}`);

            return Promise.resolve(true);
        }
        catch (ex) {
            const msg = `Error assigning user with Email ${userToAdd.email} to organisation with Id ${organisation.organisationId}`;
            console.error(msg, ex);
            throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // TODO this method is not proofed / reviewed since datamodel change; cf addUserToOrganisationAsync for how-to handle data structures
    async removeUserFromOrganisationAsync(organisationId: string, userId: string): Promise<boolean> {
        if (!organisationId || organisationId.length === 0)
            throw new HttpException(`Can't find organisation with Id ${organisationId}!`, HttpStatus.BAD_REQUEST);

        if (!userId || userId.length === 0)
            throw new HttpException("No userId is set to delete user!", HttpStatus.BAD_REQUEST);

        const organisation = await this.organisationModel.findOne({ organisationId: organisationId })
            .populate({path : 'users', populate : {path : 'user'}});

        if (!organisation)
            throw new HttpException(`No organisation with id ${organisationId} found!`, HttpStatus.BAD_REQUEST);

        // first update user model

        const userDto = await this.userService.getUserByIdAsync(userId).catch(err => console.error(err));

        if (!userDto)
            throw new InternalServerErrorException("Could not create or update User");

        let user = await this.userService.createOrUpdateUserAsync(userDto); // .catch(err => console.error(err));

        // remove roleInOrg object for current org
        const roleInOrg = user.rolesInOrganisations.find((r) => r.organisation.organisationId === organisationId);
        if (roleInOrg) { // NOTE TODO remove test, just remove right along
            // user.rolesInOrganisations = user.rolesInOrganisations.filter((r) => r.organisationId !== organisationId);
            if (!_.remove(user.rolesInOrganisations, (r) => r.organisation.organisationId === organisationId))
                throw new HttpException(`Internal error removing organisation ${organisation.name} from user with userId ${userId}`,
                    HttpStatus.BAD_REQUEST);
        }

        user = await user.save();

        // then update org model
        if (!_.some(organisation.users, (u) => u.user.userId === userId))
            throw new HttpException(`No user with userId ${userId} found on organisation ${organisation.name}`, HttpStatus.BAD_REQUEST);

        if (!_.remove(organisation.users, (u) => u.user.userId === userId))
            throw new HttpException(`Internal error removing user with userId ${userId} from organisation ${organisation.name}`,
                HttpStatus.BAD_REQUEST);

        const res = await organisation.save().catch(err => console.error(err));

        return Promise.resolve(true);
    }
}
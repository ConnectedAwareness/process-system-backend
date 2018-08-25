import { Injectable, Inject, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';

import * as _ from 'lodash';

import { of } from 'rxjs';

import { IOrganisationSchema } from '../database/interfaces/organisation.schema.interface';
import { UserService } from './user.service';
import { OrganisationFactory } from '../models/factories/organisation.factory';
import { IUser, UserRole } from '../models/interfaces/user.interface';
import { IOrganisation } from '../models/interfaces/organisation.interface';
import { RoleInOrganisationDto } from '../models/dtos/roleinorganisation.dto';
import { IRoleInOrganisation } from '../models/interfaces/roleinorganisation.interface';
import { IRoleOfUser } from '../models/interfaces/roleofuser.interface';
import { OrganisationDto } from '../models/dtos/organisation.dto';
import { IUserSchema } from '../database/interfaces/user.schema.interface';
import { UserInOrganisationDto } from '../models/dtos/userinorganisation.dto';
import { RoleOfUserDto } from '../models/dtos/roleofuser.dto';

@Injectable()
export class OrganisationService {
    constructor(
        @Inject('OrganisationModelToken') private readonly organisationModel: Model<IOrganisationSchema>,
        // NOTE next line causes UnknownDependenciesException in injector.js:129
        // @Inject('RoleOfUserModelToken') private readonly roleOfUserModel: Model<IRoleOfUserSchema>,
        @Inject('UserModelToken') private readonly userModel: Model<IUserSchema>,
        private userService: UserService) { }

    async getAllOrganisationsAsync(): Promise<IOrganisation[]> {
        const res = await this.organisationModel.find();

        if (res == null)
            return null;

        return of(res.map(o => OrganisationFactory.createOrganisation(o))).toPromise();
    }

    async getOrganisationByIdAsync(organisationId: string): Promise<IOrganisation> {
        const query = { organisationId: organisationId };
        const res = await this.organisationModel.findOne(query);

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

    async addUserToOrganisationAsync(userInOrganisation: UserInOrganisationDto): Promise<boolean> {
        if (!userInOrganisation.organisationId || userInOrganisation.organisationId.length === 0)
            throw new HttpException("Can't add user to organisation! No organisationId provided", HttpStatus.BAD_REQUEST);

        if (!userInOrganisation.userId || userInOrganisation.userId.length === 0)
            throw new HttpException("Can't add user to organisation! No userId provided", HttpStatus.BAD_REQUEST);

        if (!userInOrganisation.roles || userInOrganisation.roles.length === 0)
            throw new HttpException("Can't add user to organisation! No roles provided", HttpStatus.BAD_REQUEST);

        try {
            const user = await this.userModel.findOne({ userId: userInOrganisation.userId });

            if (!user)
                throw new InternalServerErrorException("Could not find user to add to organisation");

            const organisation = await this.organisationModel.findOne({ organisationId: userInOrganisation.organisationId });

            if (!organisation)
                throw new InternalServerErrorException("Could not find organisation to add user");

            const rolesTyped = userInOrganisation.roles.map(r => UserRole[r]);

            // first update user model
            const rio: RoleInOrganisationDto = {
                userAlias: userInOrganisation.alias,
                userRoles: rolesTyped,
                organisation: organisation
            };
            user.rolesInOrganisations.push(rio);
            await user.save();

            // then update organisation model
            const rou: RoleOfUserDto = {
                userAlias: userInOrganisation.alias,
                userRoles: rolesTyped,
                user: user
            };
            organisation.rolesOfUsers.push(rou);
            await organisation.save();

            console.log(`Successfully assigned user ${userInOrganisation.userId} with alias ${userInOrganisation.alias}` +
                ` to organisation ${userInOrganisation.organisationId} using roles ${userInOrganisation.roles}`);

            return Promise.resolve(true);
        }
        catch (ex) {
            const msg = `Error assigning user with Id ${userInOrganisation.userId} to organisation with Id ${userInOrganisation.organisationId}`;
            console.error(msg, ex);
            throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // TODO this method is not proofed / reviewed since datamodel change; cf addUserToOrganisationAsync for how-to handle data structures
    async updateOrganisationWithUserAsync(organisation: IOrganisation, role: IRoleInOrganisation, userToAdd: IUser): Promise<boolean> {
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

            let roleOfUser = organisation.rolesOfUsers.find((r) => r.user.userId === userToAdd.userId);
            if (!roleOfUser) {
                roleOfUser = Object.create(RoleOfUserDto.prototype) as IRoleOfUser;
                roleOfUser.user = userToAdd;
                organisation.rolesOfUsers.push(roleOfUser);
            }
            roleOfUser.userRoles = role.userRoles.map((r) => UserRole[r]);

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
            .populate({ path: 'users' });

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
        if (!_.some(organisation.rolesOfUsers, (u) => u.user.userId === userId))
            throw new HttpException(`No user with userId ${userId} found on organisation ${organisation.name}`, HttpStatus.BAD_REQUEST);

        if (!_.remove(organisation.rolesOfUsers, (u) => u.user.userId === userId))
            throw new HttpException(`Internal error removing user with userId ${userId} from organisation ${organisation.name}`,
                HttpStatus.BAD_REQUEST);

        const res = await organisation.save().catch(err => console.error(err));

        return Promise.resolve(true);
    }
}
import { Injectable, Inject, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';

import * as _ from 'lodash';

import { of } from 'rxjs';

import * as fs from 'fs';

import { IOrganisationSchema } from '../database/interfaces/organisation.schema.interface';
import { IUserSchema } from '../database/interfaces/user.schema.interface';
import { UserService } from './user.service';
import { OrganisationFactory } from '../models/factories/organisation.factory';
import { IUser } from '../models/interfaces/user.interface';
import { IOrganisation } from '../models/interfaces/organisation.interface';

@Injectable()
export class OrganisationService {
    constructor(
        @Inject('OrganisationModelToken') private readonly organisationModel: Model<IOrganisationSchema>,
        @Inject('UserModelToken') private readonly userModel: Model<IUserSchema>,
        private userService: UserService) { }

    async getAllOrganisationsAsync(): Promise<IOrganisation[]> {
        const res = await this.organisationModel.find();

        if (res == null)
            return null;

        return of(res.map(o => OrganisationFactory.create(o, false))).toPromise();
    }

    async getOrganisationByIdAsync(organisationId: string): Promise<IOrganisation> {
        const query = { organisationId: organisationId };
        const res = await this.organisationModel.findOne(query);

        if (res == null)
            throw new HttpException(`Organisation with Id: ${organisationId} not found`, HttpStatus.BAD_REQUEST);

        return of(OrganisationFactory.create(res, true)).toPromise();
    }

    async getOrganisationByNameAsync(name: string): Promise<IOrganisation> {
        const query = { name: name };

        const res = await this.organisationModel.findOne(query);

        if (res == null)
            return null;

        return of(OrganisationFactory.create(res, true)).toPromise();
    }

    async searchOrganisationsAsync(search?: string): Promise<IOrganisation[]> {
        if (search && search.length > 0) {
            const regex = new RegExp(search, 'i');
            const res = await this.organisationModel.find().or([
                { name: { $regex: regex } }]);

            return of(res.map(t => OrganisationFactory.create(t, true))).toPromise();
        }
        else
            return this.getAllOrganisationsAsync();
    }

    async createOrganisationAsync(organisation: IOrganisation): Promise<IOrganisation> {
        try {
            if (organisation.organisationId && organisation.organisationId.length)
                throw new HttpException("Can't create new organisation, organisation has already a organisationId", HttpStatus.BAD_REQUEST);

            if (!organisation.name || organisation.name == null)
                throw new HttpException("Can't create Organisation! NO Name supplied", HttpStatus.BAD_REQUEST);

            const searchedOrganisation = await this.getOrganisationByNameAsync(organisation.name).catch(err => console.error(err));

            if (searchedOrganisation)
                return searchedOrganisation;

            organisation.organisationId = OrganisationFactory.getId();

            const model = new this.organisationModel(organisation);

            let refetch = false;

            const res = await model.save().catch(async err => {
                if (err) {
                    // check on index error (duplicate key)
                    if (err.code === 11000)
                        refetch = true;
                    else {
                        const msg = `Error creating organisation ${organisation.name}`;
                        console.error(msg, err);
                        throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                }
            });

            if (refetch)
                return await this.getOrganisationByNameAsync(organisation.name);

            if (!res)
                console.error(`Could not create organisation ${organisation.organisationId}`);
            else
                return of(OrganisationFactory.create(res, true)).toPromise();
        } catch (error) {
            console.log(error);
        }

        return Promise.resolve(null);
    }

    async updateOrganisationAsync(organisation: IOrganisation): Promise<boolean> {
        if (!organisation.organisationId || organisation.organisationId.length === 0)
            throw new HttpException("Can't update organisation, no organisationId supplied", HttpStatus.BAD_REQUEST);

        const query = { organisationId: organisation.organisationId };

        const model = this.organisationModel.findOne(query);

        const res = await model.update(organisation);

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

    async addUserToOrganisationAsync(organisationId: string, user: IUser): Promise<boolean> {
        if (!organisationId || organisationId.length === 0)
            throw new HttpException("Can't add user to Organisation! No organisationId provided", HttpStatus.BAD_REQUEST);

        if (!user)
            throw new HttpException(`Supplied user is not set`, HttpStatus.BAD_REQUEST);

        if (!user.email)
            throw new HttpException("User has no email address set!", HttpStatus.BAD_REQUEST);

        try {
            let userModel = await this.userService.createOrUpdateUserAsync(user);

            if (!userModel)
                throw new InternalServerErrorException("Could not create or update User");

            const organisation = await this.organisationModel.findOne({ organisationId: organisationId });

            if (!organisation)
                throw new InternalServerErrorException("Could not find organisation to add User");

            userModel.organisation = organisation;

            userModel = await userModel.save();

            organisation.users.push(userModel);
            const res = await organisation.save();

            // if user was not assigned to organisation, return
            if (!res) {
                throw new HttpException(`Could not add User with Email ${user.email}` +
                    ` to organisation ${organisationId}`, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            console.log(`User ${user.email} assigned for organisation ${organisation.name}`);

            return Promise.resolve(true);
        }
        catch (ex) {
            const msg = `Error assigning user with Email ${user.email} to organisation with Id ${organisationId}`;
            console.error(msg, ex);
            throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async removeUserFromOrganisationAsync(organisationId: string, userId: string): Promise<boolean> {
        if (!organisationId || organisationId.length === 0)
            throw new HttpException(`Can't find organisation with Id ${organisationId}!`, HttpStatus.BAD_REQUEST);

        if (!userId || userId.length === 0)
            throw new HttpException("No userId is set to delete user!", HttpStatus.BAD_REQUEST);

        const organisation = await this.organisationModel.findOne({ organisationId: organisationId })
            .populate({ path: 'users'});

        if (!organisation)
            throw new HttpException(`No organisation with id ${organisationId} found!`, HttpStatus.BAD_REQUEST);

        if (_.some(organisation.users, (u) => u.userId === userId)) {

            if (_.remove(organisation.users, (u) => u.userId === userId)) {
                const res = await organisation.save();

                return Promise.resolve(true);
            }
            else
                throw new HttpException(`Internal error removing user with userId ${userId} from organisation ${organisation.name}`,
                    HttpStatus.BAD_REQUEST);
        }
        else
            throw new HttpException(`No user with userId ${userId} found on organisation ${organisation.name}`, HttpStatus.BAD_REQUEST);
    }

    // INITIAL IMPORT

    async importOrgsAndUserAsync(): Promise<void> {
        const importDataJson = fs.readFileSync('importInitData.json');
        const importData = JSON.parse(importDataJson.toString());

        if (importData.length > 0) {
            this.organisationModel.collection.drop();
            this.userModel.collection.drop();

            for (const o of importData) {
                const org = OrganisationFactory.generateFromJson(o);

                if (org == null)
                    continue;

                const users = org.users.splice(0, org.users.length);
                org.users = new Array<IUser>();

                const orgDto = await this.createOrganisationAsync(org).catch(err => console.error(err));

                if (orgDto) {
                    // add users to org
                    users.forEach(async user => {
                        await this.addUserToOrganisationAsync(orgDto.organisationId, user).catch(err => console.error(err));
                    });
                }
            }
        }
    }
}
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';

import * as _ from 'lodash';

import { Observable, of } from 'rxjs';

import { OrganisationDto } from '../models/dtos/organisation.dto';
import { OrganisationSchema } from '../schemas/organisation.schema';
import { OrganisationFactory } from '../models/factories/organisation.factory';
import { IOrganisation } from '../models/interfaces/organisation.interface';
import { UserDto } from '../models/dtos/user.dto';
import { UserService } from './user.service';
import { UserFactory } from '../models/factories/user.factory';

@Injectable()
export class OrganisationService {
    constructor(@Inject('OrganisationModelToken') private readonly organisationModel: Model<IOrganisation>,
                private userService: UserService) { }

    async getAllOrganisationsAsync(): Promise<OrganisationDto[]> {
        const res = await this.organisationModel.find();

        if (res == null)
            return null;

        return of(res.map(o => OrganisationFactory.create(o))).toPromise();
    }

    async getOrganisationByIdAsync(organisationId: string): Promise<OrganisationDto> {
        const query = { organisationId: organisationId };
        const res = await this.organisationModel.findOne(query);

        if (res == null)
            throw new HttpException(`OrganisationDto with Id: ${organisationId} not found`, HttpStatus.BAD_REQUEST);

        return of(OrganisationFactory.create(res)).toPromise();
    }

    async createOrganisationAsync(organisation: OrganisationDto): Promise<OrganisationDto> {
        try {
            if (organisation.organisationId)
                throw new HttpException("Can't create new organisation, organisationId is set", HttpStatus.BAD_REQUEST);

            const model = new this.organisationModel(organisation);
            model.organisationId = OrganisationFactory.getId();

            const res = await model.save();

            console.log(`new Organisation ${organisation.name} saved`);
            console.log(res);

            return of(OrganisationFactory.create(res)).toPromise();
        } catch (error) {
            console.log(error);
        }

        return null;
    }

    async updateOrganisationAsync(organisation: OrganisationDto): Promise<boolean> {
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

        const res = await this.organisationModel.findByIdAndRemove(organisationId);

        if (res.isDeleted())
            return Promise.resolve(true);

        throw new HttpException(`Error deleting organisation with Id: ${organisationId}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    async addUserToOrganisationAsync(organisationId: string, user: UserDto): Promise<UserDto> {
        if (!organisationId || organisationId.length === 0)
            throw new HttpException("Can't add user to organisation! No organisationId provided", HttpStatus.BAD_REQUEST);

        if (!user.email)
            throw new HttpException("User has no email address set!", HttpStatus.BAD_REQUEST);

        if (user.userId)
            throw new HttpException("User already has an userId set!", HttpStatus.BAD_REQUEST);

        const foundUser = await this.userService.getUserByEmail(user.email);

        if (foundUser)
            throw new HttpException(`User with email ${user.email} already exists!`, HttpStatus.BAD_REQUEST);

        const organisation = await this.organisationModel.findOne({ organisationId: organisationId });

        if (!organisation)
            throw new HttpException(`No organisation with id ${organisationId} found!`, HttpStatus.BAD_REQUEST);

        if (_.some(organisation.users, (u) => u.email === user.email))
            throw new HttpException('User already added to organisation', HttpStatus.BAD_REQUEST);

        const userModel = await this.userService.getModel(user);

        organisation.users.push(userModel);
        console.log(organisation);

        try {
            const res = await organisation.save();

            return of(UserFactory.create(userModel)).toPromise();
        }
        catch (ex) {
            throw new HttpException(`Internal Server Error adding user ${user.email} to organisation ${organisation.name}`,
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async removeUserFromOrganisationAsync(organisationId: string, userId: string): Promise<boolean> {
        if (!organisationId || organisationId.length === 0)
            throw new HttpException(`Can't find organisation with Id ${organisationId}!`, HttpStatus.BAD_REQUEST);

        if (!userId || userId.length === 0)
            throw new HttpException("No userId is set to delete user!", HttpStatus.BAD_REQUEST);

        const organisation = await this.organisationModel.findOne({ organisationId: organisationId });

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
}
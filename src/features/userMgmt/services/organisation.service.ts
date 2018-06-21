import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';

import * as _ from 'lodash';

import { Observable, of } from 'rxjs';

import { OrganisationDto } from '../models/dtos/organisation.dto';
import { UserDto } from '../models/dtos/user.dto';
import { OrganisationSchema } from '../schemas/organisation.schema';
import { IOrganisation } from '../models/interfaces/organisation.interface';
import { IUser } from '../models/interfaces/user.interface';
import { UserService } from './user.service';
import { OrganisationFactory } from '../models/factories/organisation.factory';
import { UserFactory } from '../models/factories/user.factory';

@Injectable()
export class OrganisationService {
    constructor(@Inject('OrganisationModelToken') private readonly organisationModel: Model<IOrganisation>,
        @Inject('UserModelToken') private readonly userModel: Model<IUser>,
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

        const query = { organisationId: organisationId };

        const res = await this.organisationModel.findOneAndRemove(query, function (err, result) {
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

    async addOrUpdateUserToOrganisationAsync(organisationId: string, user: UserDto): Promise<UserDto> {
        let newUser: boolean;

        if (!organisationId || organisationId.length === 0)
            throw new HttpException("Can't add user to organisation! No organisationId provided", HttpStatus.BAD_REQUEST);

        if (!user.email)
            throw new HttpException("User has no email address set!", HttpStatus.BAD_REQUEST);

        if (!user.userId)
            newUser = true;

        const foundUser = await this.userService.getUserByEmail(user.email);

        if (foundUser)
            newUser = false;

        const organisation = await this.organisationModel.findOne({ organisationId: organisationId });

        if (!organisation)
            throw new HttpException(`No organisation with id ${organisationId} found!`, HttpStatus.BAD_REQUEST);

        // if (_.some(organisation.users, (u) => u.email === user.email))
        //     throw new HttpException('User already added to organisation', HttpStatus.BAD_REQUEST);

        if (newUser) {
            const dbUser = await this.userService.getModel(user);
            
            dbUser.userId = UserFactory.getId();
            organisation.users.push(dbUser);
            console.log(organisation);

            try {
                const res = await organisation.save();

                return of(UserFactory.create(dbUser)).toPromise();
            }
            catch (ex) {
                throw new HttpException(`Internal Server Error adding user ${user.email} to organisation ${organisation.name}`,
                    HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        else {
            const query = { userId: user.userId };

            const res = this.userModel.findOneAndUpdate(query, user, function (err, result) {
                if (err) {
                    console.error(err);
                    throw new HttpException(`Internal Server Error updating user ${user.email} to organisation ${organisation.name}`,
                        HttpStatus.INTERNAL_SERVER_ERROR);
                }

                if (result)
                    return of(UserFactory.create(result)).toPromise();
                else 
                    return null; 
            });
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
import { Injectable, Inject, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';

import { Model } from 'mongoose';

import { of } from 'rxjs';

import { IOrganisationSchema } from '../database/interfaces/organisation.schema.interface';

import { IUserSchema } from '../database/interfaces/user.schema.interface';
import { UserFactory } from '../models/factories/user.factory';
import { IUser } from '../models/interfaces/user.interface';

@Injectable()
export class UserService {
    constructor(@Inject('UserModelToken') private readonly userModel: Model<IUserSchema>) { }

    // not used, we'll use this.userModel directly (?)
    // getModel(user: IUser): IUserSchema {
    //     const model = new this.userModel(user);
    //     return model;
    // }

    async getAllUsersAsync(): Promise<IUser[]> {
        const res = await this.userModel.find();

        if (res == null)
            return null;

        return of(res.map(u => UserFactory.createUser(u))).toPromise();
    }

    async getUserByIdAsync(userId: string): Promise<IUser> {
        try {
            const query = { userId: userId };

            const res = await this.userModel.findOne(query);

            if (res == null)
                return null;

            return of(UserFactory.createUser(res)).toPromise();
        }
        catch (err) {
            console.error(err);
        }

        return null;
    }

    async getUserByEmailAsync(email: string): Promise<IUser> {
        try {
            const query = { email: email };

            const res = await this.userModel.findOne(query);

            if (res == null)
                return null;

            return of(UserFactory.createUser(res)).toPromise();
        }
        catch (err) {
            console.error(err);
        }

        return null;
    }

    // TODO refactor: don't call createOrUpdate
    async createUserAsync(user: IUser): Promise<IUser> {
        if (user.userId && user.userId.length)
            throw new HttpException("Can't create new user, user has already a userId", HttpStatus.BAD_REQUEST);

        const res = await this.createOrUpdateUserAsync(user);

        console.log(`new User ${res.userId} saved`);

        return of(UserFactory.createUser(res)).toPromise();
    }

    // TODO refactor: don't call createOrUpdate, return boolean (like org.service)
    async updateUserAsync(userId: string, user: IUser): Promise<IUser> {
        if (user.userId && user.userId.length && user.userId !== userId)
            throw new HttpException("Can't update existing user, userIds don't match", HttpStatus.BAD_REQUEST);

        const res = await this.createOrUpdateUserAsync(user);
        return of(UserFactory.createUser(res)).toPromise();
    }

    // TODO get rid of it
    async createOrUpdateUserAsync(user: IUser): Promise<IUserSchema> {
        try {
            if (!user)
                throw new HttpException(`Supplied user is not set`, HttpStatus.BAD_REQUEST);

            if (!user.email)
                throw new HttpException("User has no email address set!", HttpStatus.BAD_REQUEST);

            const query = { email: user.email };

            const userModel = await this.userModel.findOne(query);

            if (!userModel) {
                const model = new this.userModel(user);
                model.userId = UserFactory.getId();

                return await model.save();
            }
            else // TODO take care of rolesInOrganisation, e.g. "rescue" them (cf. organsiationservice.updateOrganisation)
                await userModel.update(user); // does not return IUserSchema, in opposite to .save

            // return of(userModel).toPromise(); // does not work either
            return await this.userModel.findOne(query);
        }
        catch (err) {
            console.error(err);
        }

        return null;
    }

    async deleteUserAsync(userId: string): Promise<boolean> {
        const query = { userId: userId };

        const user = await this.userModel.findOne(query);

        if (!user)
            return true;

        if (user.rolesInOrganisations.length > 0) {
            const msg = `Cannot delete user with email ${user.email}, user is still assigned to an organisation!`;
            console.error(msg);
            // throw new InternalServerErrorException(msg);
            return false;
        }

        try {
            user.remove();

            return true;
        }
        catch (err) {
            console.error(err);
        }

        return false;
    }

    async updateUserPasswordAsync(userId: string, password: string): Promise<boolean> {
        const query = { userId: userId };

        const user = await this.userModel.findOne(query);

        if (!user)
            return false;

        try {
            user.password = password;
            await user.save();

            return true;
        }
        catch (err) {
            console.error(err);
        }

        return false;
    }

    async validateUserAsync(email: string, password: string): Promise<IUser> {
        try {
            const query = { email: email };

            const res = await this.userModel.findOne(query)
                .populate('rolesInOrganisations.organisation');

            if (res != null && res.password === password)
                return of(UserFactory.createUser(res)).toPromise();
        }
        catch (err) {
            console.error(`Error validating user with email ${email}`, err);
        }

        return null;
    }
}
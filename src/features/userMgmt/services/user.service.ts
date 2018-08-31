import { Injectable, Inject, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';

import { Model } from 'mongoose';

import { of } from 'rxjs';

import { IUserSchema } from '../database/interfaces/user.schema.interface';
import { UserFactory } from '../models/factories/user.factory';
import { IUser } from '../models/interfaces/user.interface';
import { ResetPasswordDto } from '../models/dtos/resetpasswort.dto';

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

        return of(res.map(u => UserFactory.createUser(u, false))).toPromise();
    }

    async getUserByIdAsync(userId: string): Promise<IUser> {
        try {
            const query = { userId: userId };

            const res = await this.userModel.findOne(query)
                .populate({ path: 'rolesInOrganisations', populate: { path: 'organisation' } });

            if (res == null)
                return null;

            return of(UserFactory.createUser(res, true)).toPromise();
        }
        catch (err) {
            console.error(err);
        }

        return null;
    }

    async getUserByEmailAsync(email: string): Promise<IUser> {
        try {
            const query = { email: email };

            const res = await this.userModel.findOne(query)
                .populate({ path: 'rolesInOrganisations', populate: { path: 'organisation' } });

            if (res == null)
                return null;

            return of(UserFactory.createUser(res, true)).toPromise();
        }
        catch (err) {
            console.error(err);
        }

        return null;
    }

    async createUserAsync(user: IUser): Promise<IUser> {
        if (!user)
            throw new HttpException(`Supplied user is not set`, HttpStatus.BAD_REQUEST);

        if (user.userId && user.userId.length)
            throw new HttpException("Can't create new user, user has already an userId", HttpStatus.BAD_REQUEST);

        if (!user.email)
            throw new HttpException("User has no email address set!", HttpStatus.BAD_REQUEST);

        try {
            const query = { email: user.email };

            let userModel = await this.userModel.findOne(query)
                .populate({ path: 'rolesInOrganisations', populate: { path: 'organisation' } });

            if (userModel)
                throw new HttpException(`User with email address ${user.email} already exists`, HttpStatus.BAD_REQUEST);

            userModel = new this.userModel(user);
            userModel.userId = UserFactory.getId();

            const res = await userModel.save();

            console.log(`new User ${res.userId} saved`);

            return of(UserFactory.createUser(res, false)).toPromise();
        }
        catch (err) {
            console.error(err);
        }

        return null;
    }

    async updateUserAsync(userId: string, user: IUser): Promise<IUser> {
        if (!user)
            throw new HttpException(`Supplied user is not set`, HttpStatus.BAD_REQUEST);

        if (!user.email)
            throw new HttpException("User has no email address set!", HttpStatus.BAD_REQUEST);

        if (user.userId && user.userId.length && user.userId !== userId)
            throw new HttpException("Can't update existing user, userIds don't match", HttpStatus.BAD_REQUEST);

        try {
            const query = { userId: userId };

            const userModel = await this.userModel.findOne(query)
                .populate({ path: 'rolesInOrganisations', populate: { path: 'organisation' } });

            if (!userModel)
                throw new HttpException(`Can't find user with userId ${userId}`, HttpStatus.BAD_REQUEST);

            userModel.capabilities = user.capabilities;
            userModel.email = user.email;
            userModel.firstName = user.firstName;
            userModel.lastName = user.lastName;

            const res = await userModel.save();

            return of(UserFactory.createUser(res, true)).toPromise();
        }
        catch (err) {
            console.error(err);
        }

        return null;
    }

    async deleteUserAsync(userId: string): Promise<boolean> {
        try {
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
            const res = await this.userModel.remove(query);

            if (res.ok && res.n)
                return Promise.resolve(true);
        }
        catch (err) {
            console.error(err);
        }

        return false;
    }

    async resetUserPasswordAsync(resetPassword: ResetPasswordDto): Promise<boolean> {
        const query = { userId: resetPassword.userId };

        const user = await this.userModel.findOne(query);

        if (!user)
            throw new HttpException(`Can't find user with userId ${resetPassword.userId}`, HttpStatus.BAD_REQUEST);

        if (user.password !== resetPassword.oldPassword)
            throw new HttpException(`Wrong password for user with userId ${resetPassword.userId}`, HttpStatus.BAD_REQUEST);

        try {
            user.password = resetPassword.newPassword;
            await user.save();

            return true;
        }
        catch (err) {
            console.error(err);
            throw new HttpException(`An error occured when trying to set new password for user with userId ${resetPassword.userId}`,
                HttpStatus.BAD_REQUEST);
        }
    }

    async validateUserAsync(email: string, password: string): Promise<IUser> {
        try {
            const query = { email: email };

            const res = await this.userModel.findOne(query)
                .populate({ path: 'rolesInOrganisations', populate: { path: 'organisation' } });

            if (res != null && res.password === password)
                return of(UserFactory.createUser(res, true)).toPromise();
        }
        catch (err) {
            console.error(`Error validating user with email ${email}`, err);
        }

        return null;
    }
}
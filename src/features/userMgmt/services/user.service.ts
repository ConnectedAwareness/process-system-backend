import { Injectable, Inject, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';

import { Model } from 'mongoose';

import { of } from 'rxjs';

import { IOrganisation } from '../models/interfaces/organisation.interface';

import { UserDto } from '../models/dtos/user.dto';
import { IUser } from '../models/interfaces/user.interface';
import { UserFactory } from '../models/factories/user.factory';

@Injectable()
export class UserService {
    constructor(@Inject('UserModelToken') private readonly userModel: Model<IUser>,
                @Inject('OrganisationModelToken') private readonly organisationModel: Model<IOrganisation>) { }

    getModel(user: UserDto): IUser {
        const model = new this.userModel(user);
        return model;
    }

    async getUserByIdAsync(userId: string): Promise<UserDto> {
        try {
            const query = { userId: userId };

            const res = await this.userModel.findOne(query)
                .populate({ path: 'organisation' });

            if (res == null)
                return null;

            return of(UserFactory.create(res)).toPromise();
        }
        catch (err) {
            console.error(err);
        }

        return null;
    }

    async getUserByEmailAsync(email: string): Promise<UserDto> {
        try {
            const query = { email: email };

            const res = await this.userModel.findOne(query)
                .populate({ path: 'organisation' });

            if (res == null)
                return null;

            return of(UserFactory.create(res)).toPromise();
        }
        catch (err) {
            console.error(err);
        }

        return null;
    }

    async createUserAsync(user: UserDto): Promise<UserDto> {
        const res = await this.createOrUpdateUserAsync(user);
        return of(UserFactory.create(res)).toPromise();
    }

    async updateUserAsync(userId: string, user: UserDto): Promise<UserDto> {
        const res = await this.createOrUpdateUserAsync(user);
        return of(UserFactory.create(res)).toPromise();
    }

    async createOrUpdateUserAsync(user: UserDto): Promise<IUser> {
        try {
            if (!user)
                throw new HttpException(`Supplied user is not set`, HttpStatus.BAD_REQUEST);

            if (!user.email)
                throw new HttpException("User has no email address set!", HttpStatus.BAD_REQUEST);

            const query = { email: user.email };

            let res = await this.userModel.findOne(query);

            if (!res) {
                const model = new this.userModel(user);
                model.userId = UserFactory.getId();

                res = await model.save();
            }
            else
                res = await this.userModel.findOneAndRemove(user);

            return res;
        }
        catch (err) {
            console.error(err);
        }

        return null;
    }

    async deleteUserAsync(userId: string): Promise<boolean> {
        const query = { userId: userId };

        const user = await this.userModel.findOne(query)
            .populate({ path: 'organisation' });

        if (!user)
            return true;

        if (user.organisation) {
            const msg = `Cannot delete user with email ${user.email}, user is still assigned to an organisation!`;
            console.error(msg);
            // throw new InternalServerErrorException(msg);
            return false;
        }

        try {
            const model = this.getModel(user);

            model.remove();

            return true;
        }
        catch (err) {
            console.error(err);
        }

        return false;
    }

    async validateUserAsync(email: string, password: string): Promise<UserDto> {
        try {
            const query = { email: email };

            const res = await this.userModel.findOne(query);

            if (res != null && res.password === password)
                return of(UserFactory.create(res)).toPromise();
        }
        catch (err) {
            console.error(`Error validating user with email ${email}`, err);
        }

        return null;
    }
}
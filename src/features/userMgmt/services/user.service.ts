import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';

import { Model } from 'mongoose';

import { Observable, of } from 'rxjs';

import { IOrganisation } from '../models/interfaces/organisation.interface';
import { OrganisationFactory } from '../models/factories/organisation.factory';

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

    async create(organisationId: string, user: UserDto): Promise<UserDto> {
        const model = new this.userModel(user);

        const result = await model.save();

        return result;
    }

    async getUserByEmail(email: string): Promise<UserDto> {
        try {
            const query = {'users.email': email};

            const res = await this.organisationModel.findOne(query, {'users.$': 1},
                (err, org) => {
                    if (org) {
                        console.log(org.users[0]);
                    }
                }
            );

            if (res == null || res.users == null || res.users.length !== 1)
                return null;

            return of(UserFactory.create(res.users[0])).toPromise();
        } catch (error) {

        }

        return null;
    }
}
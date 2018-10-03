import { Injectable, Inject, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';

import * as _ from 'lodash';

import { of } from 'rxjs';

import * as util from '../../../common/util/util';

import { IOrganisationSchema } from '../database/interfaces/organisation.schema.interface';
import { OrganisationFactory } from '../models/factories/organisation.factory';
import { IOrganisation } from '../../../../npm-interfaces/src/userMgmt/organisation.interface';
import { OrganisationDto } from '../models/dtos/organisation.dto';

@Injectable()
export class OrganisationService {
    constructor(@Inject('OrganisationModelToken') private readonly organisationModel: Model<IOrganisationSchema>) { }

    async getAllOrganisationsAsync(): Promise<IOrganisation[]> {
        const res = await this.organisationModel.find();

        if (res == null)
            return null;

        return of(res.map(o => OrganisationFactory.createOrganisation(o, false))).toPromise();
    }

    async getOrganisationByIdAsync(organisationId: string): Promise<IOrganisation> {
        const query = { organisationId: organisationId };

        const res = await this.organisationModel.findOne(query)
            .populate({ path: 'users', populate: { path: 'user' } });

        if (res == null)
            throw new HttpException(`Organisation with Id: ${organisationId} not found`, HttpStatus.BAD_REQUEST);

        return of(OrganisationFactory.createOrganisation(res, true)).toPromise();
    }

    async getOrganisationByNameAsync(name: string): Promise<IOrganisation> {
        const query = { name: name };

        const res = await this.organisationModel.findOne(query)
            .populate({ path: 'users', populate: { path: 'user' } });

        if (res == null)
            return null;

        return of(OrganisationFactory.createOrganisation(res, true)).toPromise();
    }

    async searchOrganisationsAsync(search?: string): Promise<IOrganisation[]> {
        if (search && search.length > 0) {
            const regex = new RegExp(search, 'i');
            const res = await this.organisationModel.find().or([
                { name: { $regex: regex } }]);

            return of(res.map(t => OrganisationFactory.createOrganisation(t, false))).toPromise();
        }
        else
            return this.getAllOrganisationsAsync();
    }

    async createOrganisationAsync(organisation: IOrganisation): Promise<OrganisationDto> {
        if (!organisation)
            throw new HttpException(`Supplied organisation is not set`, HttpStatus.BAD_REQUEST);

        if (organisation.organisationId && organisation.organisationId.length)
            throw new HttpException("Can't create new organisation, organisation has already an organisationId", HttpStatus.BAD_REQUEST);

        if (!organisation.name)
            throw new HttpException("organisation has no nane set!", HttpStatus.BAD_REQUEST);

        if (organisation.users && organisation.users.length)
            throw new HttpException("Can't create new organisation, must not contain users", HttpStatus.BAD_REQUEST);

        try {
            const query = { name: organisation.name };

            let orgModel = await this.organisationModel.findOne(query);

            if (orgModel)
                throw new HttpException(`Organisation with name ${organisation.name} already exists`, HttpStatus.BAD_REQUEST);

            orgModel = new this.organisationModel(organisation);
            orgModel.organisationId = util.getId();

            const res = await orgModel.save();

            console.log(`new Organisation with name ${orgModel.name} and organisationId ${orgModel.organisationId} saved`);

            return of(OrganisationFactory.createOrganisation(res, false)).toPromise();

        } catch (error) {
            console.log(error);
        }
    }

    async updateOrganisationAsync(organisationId: string, organisation: IOrganisation): Promise<IOrganisation> {
        if (!organisation)
            throw new HttpException(`Supplied user is not set`, HttpStatus.BAD_REQUEST);

        if (!organisation.name)
            throw new HttpException("User has no email address set!", HttpStatus.BAD_REQUEST);

        if (!organisation.organisationId || organisation.organisationId.length === 0)
            throw new HttpException("Can't update organisation, no organisationId supplied", HttpStatus.BAD_REQUEST);

        if (organisation.organisationId && organisation.organisationId.length && organisation.organisationId !== organisationId)
            throw new HttpException("Can't update existing user, userIds don't match", HttpStatus.BAD_REQUEST);

        try {
            const query = { organisationId: organisationId };

            const model = await this.organisationModel.findOne(query);

            model.name = organisation.name;
            model.version = organisation.version;

            const res = await model.save();

            console.log("Organisation updated");
            console.log(res);

            return of(OrganisationFactory.createOrganisation(res, true)).toPromise();
        }
        catch (err) {
            console.error(err);
        }

        return null;
    }

    async deleteOrganisationAsync(organisationId: string): Promise<boolean> {
        if (!organisationId || organisationId.length === 0)
            throw new HttpException("Can't delete organisation, no organisationId supplied", HttpStatus.BAD_REQUEST);

        try {
            const query = { organisationId: organisationId };

            const res = await this.organisationModel.remove(query);

            if (res.ok && res.n)
                return Promise.resolve(true);

        } catch (error) {
            console.log(`Error deleting organisation with organisationId ${organisationId}`, error);
        }

        return Promise.resolve(false);
    }

    async deleteAllOrganisationsAsync(): Promise<boolean> {
        // NOTE no check, as deleteOrganisationAsync does not check too
        await this.organisationModel.collection.remove({});
        return Promise.resolve(true);
    }
}
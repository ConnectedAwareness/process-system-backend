import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { IOrganisation, Organisation } from '../models/organisation.representation';

@Injectable()
export class OrganisationService {
    constructor(@Inject('OrganisationModelToken') private readonly organisationModel: Model<IOrganisation>) {}

    async createOne(organisation: Organisation){
        const createdOrganisation = new this.organisationModel(organisation);
        return await createdOrganisation.save();
    }
    async readAll(){
        return await this.organisationModel.find().exec();
    }
    async readOne(id: number){
        // return await this.organisationModel.find().exec();
    }
    async updateOne(id: number){
        // return await this.organisationModel.find().exec();
    }
    async deleteOne(id: number){
        // return await this.organisationModel.find().exec();
    }
}
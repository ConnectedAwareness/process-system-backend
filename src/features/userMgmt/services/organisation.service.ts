import { Model } from 'mongoose';
import { Component } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrganisationSchema, Organisation } from '../models/organisation.representation';

@Component()
export class OrganisationService {
    constructor(@InjectModel(OrganisationSchema) private readonly organisationModel: Model<Organisation>) {}
    
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
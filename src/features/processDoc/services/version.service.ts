import { Model } from 'mongoose';
import { Component, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { VersionSchema, Version, IVersion } from '../models/version.representation';

@Component()
export class VersionService {
    constructor(@InjectModel(VersionSchema) private readonly versionModel: Model<Version>) {}

    async importVersion(version: IVersion){
        const createdVersion = new this.versionModel(version);
        return await createdVersion.save();
    }
    async getVersion(id: number){
        return await this.versionModel.find().exec();
    }
}
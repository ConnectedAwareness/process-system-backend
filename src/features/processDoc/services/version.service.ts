import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';

import { Version } from '../models/version.representation';
import { VersionSchema } from '../schemas/version.schema';
@Injectable()
export class VersionService {
    constructor(@Inject('VersionModelToken') private readonly versionModel: Model<Version>) { }

    // CRUD

    async getVersionAsync(versionId: string): Promise<Version> {
        const query = { versionId: versionId };

        const version = await this.versionModel.findOne(query);

        if (version == null)
            throw new HttpException(`Version with Id: ${versionId} not found`, HttpStatus.BAD_REQUEST);

        return version;
    }

    async createVersionAsync(version: Version): Promise<Version> {
        if (!version.versionId || version.versionId.length === 0)
            throw new HttpException("Can't create new version, no versionId supplied", HttpStatus.BAD_REQUEST);

        const model = new this.versionModel(version);

        const res = await model.save();

        console.log(`new Version ${version.versionId} saved`);
        console.log(res);

        return version;
    }

    async updateVersionAsync(version: Version): Promise<boolean> {
        if (!version.versionId || version.versionId.length === 0)
            throw new HttpException("Can't fetch version, no versionId supplied", HttpStatus.BAD_REQUEST);

        const query = { versionId: version.versionId };

        const model = this.versionModel.findOne(query);

        const res = await model.update(version);

        return true;
    }

    // END CRUD

    async importElementsRecursiveAsync(versionId: string, versionfile: string): Promise<boolean> {
        if (!versionId || versionId.length === 0)
            throw new HttpException("Can't fetch version, no versionId supplied", HttpStatus.BAD_REQUEST);

        const version = await this.getVersionAsync(versionId);

        if (versionfile.length === 0)
            throw new HttpException(`No elements found to import!`, HttpStatus.BAD_REQUEST);

        this.updateVersionAsync(version);

        const result = await this.getVersionAsync(versionId);

        return true;
    }

    async parseRecursive(versionfile: string, version: Version) {
        const elementList = versionfile.split("####");

        elementList.forEach(element => {
            if (element) {
                const parts = element.split('\t');

                if (parts.length === 6) {
                    const id = parts[1];
                    const type = parts[2];
                    const level = parts[3];
                    const text = parts[5];
                }
            }
        });
    }
}
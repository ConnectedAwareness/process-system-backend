import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';

import * as fs from 'fs';

import { Observable, of } from 'rxjs';

import { VersionDto } from '../models/dtos/version.dto';
import { VersionFactory } from '../models/factories/version.factory';
import { IVersionSchema } from '../database/interfaces/version.schema.interface';
import { IVersion } from '../models/interfaces/version.interface';
import { INodeContainer } from '../models/interfaces/nodecontainer.interface';
import { INodeContainerSchema } from '../database/interfaces/nodecontainer.schema.interface';
import { INodeSchema } from '../database/interfaces/node.schema.interface';
import { NodeSchema } from '../database/schemas/node.schema';

@Injectable()
export class VersionService {

    constructor(
        @Inject('VersionModelToken') private readonly versionModel: Model<IVersionSchema>,
        @Inject('NodeModelToken') private readonly nodeModel: Model<INodeSchema>) { }

    // "CRUD"

    async getAllVersionsAsync(): Promise<IVersion[]> {
        const res = await this.versionModel.find();

        if (res == null)
            return null;

        return of(res.map(v => VersionFactory.create(v))).toPromise();
    }

    async getVersionAsync(versionId: string): Promise<IVersion> {
        const query = { versionId: versionId };
        const res = await this.versionModel.findOne(query);

        if (res == null)
            throw new HttpException(`VersionDto with Id: ${versionId} not found`, HttpStatus.BAD_REQUEST);

        return of(VersionFactory.create(res)).toPromise();
    }

    async createVersionAsync(version: IVersion): Promise<IVersion> {
        try {
            if (!version.versionId || version.versionId.length === 0)
                throw new HttpException("Can't create new version, no versionId supplied", HttpStatus.BAD_REQUEST);

            const model = new this.versionModel(version);

            const res = await model.save();

            console.log(`new VersionDto ${version.versionId} saved`);
            console.log(res);

            return of(VersionFactory.create(res)).toPromise();

        } catch (error) {
            console.log(error);
        }
    }

    async updateVersionAsync(version: IVersion): Promise<IVersion> {
        if (!version.versionId || version.versionId.length === 0)
            throw new HttpException("Can't fetch version, no versionId supplied", HttpStatus.BAD_REQUEST);

        const query = { versionId: version.versionId };

        const model = await this.versionModel.findOne(query);

        // TODO set some values... e.g. the complete tree (?!)
        // TODO think about it ... do we even need an update?
        model.published = version.published;

        model.nodes = version.nodes.map(n => new this.nodeModel(n));
        // // first reset nodes in model
        // model.nodes = new Array<INodeSchema>();
        // // then copy tree -- NOTE we must iterate through the complete tree, since mongo's push() replaces/wraps given obj by EmbeddedObject
        // this.pushTreeIteratively(model, version);

        const res = await model.save();

        console.log("Version updated");
        console.log(res);

        return of(VersionFactory.create(res)).toPromise();
    }

    private pushTreeIteratively(targetNodeContainerModel: INodeContainerSchema, sourceNodeContainer: INodeContainer) {
        for (const sourceNode of sourceNodeContainer.nodes) {
            const sourceNodeModel = new this.nodeModel(sourceNode);
            targetNodeContainerModel.nodes.push(sourceNodeModel);
            const targetNodeModel = targetNodeContainerModel.nodes[targetNodeContainerModel.nodes.length - 1];
            this.pushTreeIteratively(targetNodeModel, sourceNode);
        }
    }
}
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';

import * as fs from 'fs';

import { Observable, of } from 'rxjs';

import { ElementDto } from '../models/dtos/element.dto';
import { IElementSchema } from '../database/interfaces/element.schema.interface';
import { ElementType } from '../models/interfaces/elementtype.enum';
import { IElement } from '../models/interfaces/element.interface';
import { ElementFactory } from '../models/factories/element.factory';
import { IElementVersion } from '../models/interfaces/elementversion.interface';
import { IElementVersionSchema } from '../database/interfaces/elementversion.schema.interface';

@Injectable()
export class ElementService {

    constructor(
        @Inject('ElementModelToken') private readonly elementModel: Model<IElementSchema>,
        @Inject('ElementVersionModelToken') private readonly elementVersionModel: Model<IElementVersionSchema>) { }

    // "CRUD" for IElement

    async getAllElementsAsync(): Promise<IElement[]> {
        const res = await this.elementModel.find();

        if (res == null)
            return null;

        return of(res.map(e => ElementFactory.createElement(e))).toPromise();
    }

    private async getElementSchemaAsync(elementId: string): Promise<IElementSchema> {
        if (!elementId || elementId.length === 0)
            throw new HttpException("Can't get element, no elementId supplied", HttpStatus.BAD_REQUEST);

        const query = { elementId: elementId };
        const res = await this.elementModel.findOne(query);

        if (res == null)
            throw new HttpException(`ElementDto with Id: ${elementId} not found`, HttpStatus.BAD_REQUEST);

        return res;
    }

    async getOrCreateElementAsync(element: IElement): Promise<IElement> {
        let res = null as ElementDto;
        try {
            res = await this.getElementAsync(element.elementId);
        } catch (HttpException) {
            res = await this.createElementAsync(element);
        }
        // NOTE TODO Promise.resolve(res)? or is this wrapped automatically? both methods (get, create) return Promise thus it's sufficient
        return res;
    }

    async getElementAsync(elementId: string): Promise<IElement> {
        const res = await this.getElementSchemaAsync(elementId);
        return of(ElementFactory.createElement(res)).toPromise();
    }

    async createElementAsync(element: IElement): Promise<IElement> {
        try {
            if (!element.elementId || element.elementId.length === 0)
                throw new HttpException("Can't create new element, no elementId supplied", HttpStatus.BAD_REQUEST);

            const model = new this.elementModel(element);

            const res = await model.save();

            console.log(`new ElementDto ${element.elementId} saved`);
            console.log(res);

            return of(ElementFactory.createElement(res)).toPromise();

        } catch (error) {
            console.log(error);
        }
    }

    // async updateElementAsync(element: IElement): Promise<IElement> {
    //     if (!element.elementId || element.elementId.length === 0)
    //         throw new HttpException("Can't fetch element, no elementId supplied", HttpStatus.BAD_REQUEST);

    //     const query = { elementId: element.elementId };

    //     const model = await this.elementModel.findOne(query);

    //     // TODO set some values... e.g. the complete tree (?!)
    //     // TODO think about it ... do we even need an update?
    //     // model.xyz = element.xyz;

    //     const res = await model.save();

    //     console.log("Element updated");
    //     console.log(res);

    //     return of(ElementFactory.create(res)).toPromise();
    // }

    // "CRUD" for IElementVersion

    async getLatestElementVersionAsync(elementId: string): Promise<IElementVersion> {
        const e = await this.getElementSchemaAsync(elementId);

        const res = e.elementVersions[e.elementVersions.length - 1];

        return of(ElementFactory.createElementVersion(res)).toPromise();
    }

    // TODO do we need elementId, since elementVersion.element should be set?!
    async appendElementVersionAsync(elementId: string, elementVersion: IElementVersion): Promise<IElementVersion> {
        const e = await this.getElementSchemaAsync(elementId);

        try {
            const model = new this.elementVersionModel(elementVersion);
            model.element = e;
            const res = await model.save();

            console.log(`new ElementVersionDto ${elementVersion.text.substring(0, 10)} saved`);
            console.log(res);

            e.elementVersions.push(model);
            await e.save();

            return of(ElementFactory.createElementVersion(res)).toPromise();

        } catch (error) {
            console.log(error);
        }
    }
}
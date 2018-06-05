import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';

import * as fs from 'fs';

import { Observable, of } from 'rxjs';

import { VersionDto } from '../models/dtos/version.dto';
import { ElementDto } from '../models/dtos/element.dto';
import { VersionSchema } from '../schemas/version.schema';
import { VersionFactory } from '../models/factories/version.factory';
import { IVersion } from '../models/interfaces/version.interface';
import { IElement, ElementType } from '../models/interfaces/element.interface';
import { IComment } from '../models/interfaces/comment.interface';

@Injectable()
export class VersionService {

    constructor(@Inject('VersionModelToken') private readonly versionModel: Model<IVersion>,
                @Inject('ElementModelToken') private readonly elementModel: Model<IElement>) { }

    // CRUD

    async getVersionAsync(versionId: string): Promise<VersionDto> {
        const query = { versionId: versionId };
        const res = await this.versionModel.findOne(query);

        if (res == null)
            throw new HttpException(`VersionDto with Id: ${versionId} not found`, HttpStatus.BAD_REQUEST);

        return of(VersionFactory.create(res)).toPromise();
    }

    async createVersionAsync(version: VersionDto): Promise<VersionDto> {
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

    async updateVersionAsync(version: VersionDto): Promise<boolean> {
        if (!version.versionId || version.versionId.length === 0)
            throw new HttpException("Can't fetch version, no versionId supplied", HttpStatus.BAD_REQUEST);

        const query = { versionId: version.versionId };

        const model = this.versionModel.findOne(query);

        const res = await model.update(version);

        console.log("Version updated");
        console.log(res);

        //return of(VersionFactory.create(res)).toPromise();
        return true;
    }

    // END CRUD

    async importElementsRecursiveAsync(versionId: string, versionfile: string): Promise<boolean> {
        versionfile = fs.readFileSync('version_import.txt').toString();

        if (!versionId || versionId.length === 0)
            throw new HttpException("Can't fetch version, no versionId supplied", HttpStatus.BAD_REQUEST);

        let version: VersionDto = await this.getVersionAsync(versionId);

        console.log("original Version:");
        console.log(version);

        if (!versionfile || versionfile.length === 0)
            throw new HttpException(`No elements found to import!`, HttpStatus.BAD_REQUEST);

        version = await this.parseRecursive(versionfile, version);

        console.log("Version to import:");
        console.log(version);

        const result = await this.updateVersionAsync(version);

        const newVersion = await this.getVersionAsync(versionId);

        console.log("imported Version:");
        console.log(newVersion);

        return result;
    }

    async parseRecursive(versionfile: string, version: VersionDto): Promise<VersionDto> {
        if (version.elements && version.elements.length > 0)
            throw new HttpException(`VersionDto object already has element list!`, HttpStatus.BAD_REQUEST);
        try {
            const parsedLevel = 0;
            const elementList = versionfile.split("#####");

            const elements = await this._parseRecursive(elementList, parsedLevel);

            version.elements = new Array<ElementDto>();

            elements.forEach(e => version.elements.push(e));
            //version.elements.push(elements);

            return version;
        } catch (error) {
            console.log(error);
        }
    }

    async _parseRecursive(elementList: string[], parsedLevel: number): Promise<Array<ElementDto>> {
        const elements = new Array<ElementDto>();
        let lastElement = null;
        let parsedElement = null;

        do {
            parsedElement = elementList.shift();

            if (parsedElement) {
                const parts = parsedElement.split('\t');

                if (parts.length === 6) {
                    const id = parts[1].trim();
                    const type = parts[2].trim();
                    const level = +parts[3];
                    const text = parts[5].trim();

                    // add to element elements
                    if (level === parsedLevel) {
                        const newElement = Object.create(ElementDto.prototype);
                        newElement.elementId = id;
                        newElement.type = await this.parseElementType(type);
                        newElement.text = text;
                        newElement.elements = new Array<ElementDto>();

                        lastElement = newElement;
                        elements.push(newElement);
                    }
                    // go into recursive parsing and add list of elements to lastElement
                    else if (level > parsedLevel) {
                        // push parsedElement again at first position
                        elementList.unshift(parsedElement);

                        const subElements = await this._parseRecursive(elementList, level);
                        lastElement.elements.push(subElements);
                    }
                    // stop iteration of elementList and return elements
                    else if (level < parsedLevel) {
                        // push parsedElement again at first position
                        elementList.unshift(parsedElement);

                        return elements;
                    }
                }
            }
        }
        while (elementList.length > 0);

        return elements;
    }

    async parseElementType(elementType: string): Promise<ElementType> {
        switch (elementType) {
            case "Header1":
            case "Header2":
            case "Header3":
                return ElementType.Header;
            case "Text":
                return ElementType.Text;
            case "Particle":
                return ElementType.Particle;
            case "Definition":
                return ElementType.Definition;
            case "Example":
                return ElementType.Example;
            case "Explanation":
                return ElementType.Explanation;
            default:
                return ElementType.Unknown;
        }
    }
}
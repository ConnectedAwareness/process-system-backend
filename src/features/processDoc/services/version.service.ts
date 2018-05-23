import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';

import { Version } from '../models/version.representation';
import { Element, ElementType } from '../models/element.representation';
import { VersionSchema } from '../schemas/version.schema';

import * as fs from 'fs';

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
        versionfile = fs.readFileSync('version_import.txt').toString();

        if (!versionId || versionId.length === 0)
            throw new HttpException("Can't fetch version, no versionId supplied", HttpStatus.BAD_REQUEST);

        let version = await this.getVersionAsync(versionId);

        if (!versionfile || versionfile.length === 0)
            throw new HttpException(`No elements found to import!`, HttpStatus.BAD_REQUEST);

        version = await this.parseRecursive(versionfile, version);

        this.updateVersionAsync(version);

        const result = await this.getVersionAsync(versionId);

        return true;
    }

    async parseRecursive(versionfile: string, version: Version): Promise<Version> {
        if (version.elements && version.elements.length > 0)
            throw new HttpException(`Version object already has element list!`, HttpStatus.BAD_REQUEST);

        const parsedLevel = 0;
        const elementList = versionfile.split("#####");

        const elements = await this._parseRecursive(elementList, parsedLevel);

        version.elements.concat(elements);

        return version;
    }

    async _parseRecursive(elementList: string[], parsedLevel: number): Promise<Element[]> {
        const elements = new Array<Element>();
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
                        const newElement = new Element();
                        newElement.elementId = id;
                        newElement.type = await this.parseElementType(type);
                        newElement.text = text;

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
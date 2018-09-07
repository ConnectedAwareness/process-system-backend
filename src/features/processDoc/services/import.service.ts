import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';

import * as fs from 'fs';

import { Observable, of } from 'rxjs';

import { VersionDto } from '../models/dtos/version.dto';
import { ElementDto } from '../models/dtos/element.dto';
import { IVersionSchema } from '../database/interfaces/version.schema.interface';
import { IElementSchema } from '../database/interfaces/element.schema.interface';
import { INodeContainer } from '../models/interfaces/nodecontainer.interface';
import { ElementType } from '../models/interfaces/elementtype.enum';
import { VersionService } from './version.service';
import { IVersion } from '../models/interfaces/version.interface';
import { ElementVersionDto } from '../models/dtos/elementversion.dto';
import { NodeDto } from '../models/dtos/node.dto';
import { INode } from '../models/interfaces/node.interface';
import { ElementService } from './element.service';
import { IElementVersion } from '../models/interfaces/elementversion.interface';

@Injectable()
export class ImportService {

    constructor(
        @Inject('VersionModelToken') private readonly versionModel: Model<IVersionSchema>,
        @Inject('ElementModelToken') private readonly elementModel: Model<IElementSchema>,
        private versionService: VersionService,
        private elementService: ElementService) { }

    async importElementsRecursiveAsync(versionId: string, versionfile: string): Promise<IVersion> {
        if (!versionfile) versionfile = fs.readFileSync('ProzDok_1.1_Ausschnitt_formatiert_2018-09-02.tsv').toString();

        if (!versionfile || versionfile.length === 0)
            throw new HttpException(`No versionfile csv found to import!`, HttpStatus.BAD_REQUEST);

        if (!versionId || versionId.length === 0)
            throw new HttpException("Can't import version, no versionId supplied", HttpStatus.BAD_REQUEST);

        let version: VersionDto = await this.versionService.getVersionAsync(versionId);

        if (version.nodes && version.nodes.length > 0) {
            // we won't deny an update, just remove all previously existing nodes
        //     throw new HttpException(`Can't import version, existing VersionDto object already has nodes!`, HttpStatus.BAD_REQUEST);
            version.nodes = new Array<NodeDto>();
            await this.versionService.updateVersionAsync(version);
        }

        console.log("original Version:");
        console.log(version);

        version = await this.parseIterative(versionfile, version);

        console.log("Version to import:");
        console.log(version);

        const result = await this.versionService.updateVersionAsync(version);
        // const newVersion = await this.documentService.getVersionAsync(versionId);

        console.log("imported Version:");
        // console.log(newVersion);
        console.log(result);

        return result;
    }

    async parseIterative(versionfile: string, version: VersionDto): Promise<VersionDto> {

        try {
            const lines = versionfile.split(/[\r\n]+\t/);
            lines[0] = lines[0].substring(1); // trim leading \t of first line

            // path: path to current IParentElement, used to retrieve parents. path[0] is always VersionDto
            const path = new Array<INodeContainer>();
            path.push(version);
            // root: current root to push new elements to
            const root = () => path[path.length - 1];
            const container = () => root().nodes;

            for (const line of lines) {
                const parts = line.split('\t');

                if (parts.length === 4) {
                    const id = parts[0].trim();
                    const type = parts[1].trim();
                    const order = parts[2].trim();
                    const text = parts[3].trim();

                    const elemId = id && id.length ? id : null;
                    const elemType = await this.parseElementType(type);
                    const elemOrder = order && order.length ? Number.parseInt(order) : null;

                    const isStructuringElement = elemType === ElementType.Header;
                    // set path.length so that last element is this headers parent
                    if (isStructuringElement) path.length = Number.parseInt(type.substring(6)); // TODO dirtyly get level from "Header123"

                    let e: ElementDto = {
                        elementId: elemId,
                        type: elemType,
                        elementVersions: new Array<IElementVersion>()
                    };
                    e = await this.elementService.getOrCreateElementAsync(e);

                    const v: ElementVersionDto = {
                        element: null,
                        order: elemOrder,
                        text: text,
                    };
                    const vModel = await this.elementService.appendElementVersionAsync(e.elementId, v);

                    // NOTE problems setting reference to elementVersion object
                    // - when setting n.elementVersion to v, it is null after mongo's container().push()
                    // - when setting n.elementVersion to vModel, we get a "Maximum call stack size exceeded" exception in mongo's container().push()
                    // it seems like elementVersion shall be set in a Schema model, not in the dto
                    const n: NodeDto = {
                        elementVersion: null,
                        nodes: new Array<INode>()
                    };
                    container().push(n);
                    console.log(`pushed element ${elemType}:${elemId} to parent ${root()} `);

                    // those lines fix the problem with setting elementVersion reference
                    const nModel = container()[container().length - 1];
                    nModel.elementVersion = vModel; // TODO "Maximum call stack size exceeded" at this line
                    // TODO most probably nModel must have been save()d before adding

                    if (isStructuringElement) path.push(nModel);
                }
            }
            return version;
        } catch (error) {
            console.log(error);
        }
    }

    async parseElementType(elementType: string): Promise<ElementType> {
        switch (elementType) {
            case "Header1":
            case "Header2":
            case "Header3":
                return ElementType.Header;
            case "Intro":
                return ElementType.Intro;
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
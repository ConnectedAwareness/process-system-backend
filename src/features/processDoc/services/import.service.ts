import { Injectable, Inject, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
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
import { ILinkedNodeSchema } from '../database/interfaces/linkednode.schema.interface.';
import { IElementVersionSchema } from '../database/interfaces/elementversion.schema.interface';

@Injectable()
export class ImportService {

    constructor(
        @Inject('VersionModelToken') private readonly versionModel: Model<IVersionSchema>,
        @Inject('ElementModelToken') private readonly elementModel: Model<IElementSchema>,
        @Inject('ElementVersionModelToken') private readonly elementVersionModel: Model<IElementVersionSchema>,
        @Inject('LinkedNodeModelToken') private readonly linkedNodeModel: Model<ILinkedNodeSchema>,
        private versionService: VersionService,
        private elementService: ElementService) { }

    async importElementsRecursiveAsync(versionId: string, versionfilePath: string): Promise<IVersion> {
        try {
            //if (!versionfilePath) versionfilePath = 'ProzDok_1.1_Ausschnitt_formatiert_2018-09-02.tsv';

            if (!versionfilePath)
                throw new BadRequestException("no version file supplied");

            const versionfile = fs.readFileSync(versionfilePath).toString();

            if (!versionfile || versionfile.length === 0)
                throw new HttpException(`No versionfile tsv found to import!`, HttpStatus.BAD_REQUEST);

            if (!versionId || versionId.length === 0)
                throw new HttpException("Can't import version, no versionId supplied", HttpStatus.BAD_REQUEST);

            // NOTE remove existing data since we'd get exceptions otherwise (i.e. it exists for simpler debugging purposes only)
            // TODO replace this by:
            // (a) [must] a method getOrCreateElement (by ID identity) (call in parseIterative)
            // (b) [must] a method getOrCreateVersion (by value identity) (call in parseIterative)
            // (c) [thinkabout] remove the linkedNodeModel tree starting at version.linkedNodeRoot (here)
            console.log("### Emptying collections: elementModel, elementVersionModel, linkedNodeModel");
            console.log("### this removes ALL existing version data; for debugging purposes only");
            await this.elementModel.collection.remove({});
            await this.elementVersionModel.collection.remove({});
            await this.linkedNodeModel.collection.remove({});

            const version: VersionDto = await this.versionService.getVersionNormalizedAsync(versionId, 0);

            console.log("original Version:");
            console.log(version);

            if (version.nodes && version.nodes.length > 0) {
                // we won't deny an update, just remove all previously existing nodes
                //     throw new HttpException(`Can't import version, existing VersionDto object already has nodes!`, HttpStatus.BAD_REQUEST);
                console.log("Existing version has treeNodes, I will remove them");
                version.nodes = new Array<NodeDto>();
                await this.versionService.updateVersionAsync(version);
            }

            if (version.linkedNodeRoot) {
                // we won't deny an update, just remove all previously existing nodes
                //     throw new HttpException(`Can't import version, existing VersionDto object already has nodes!`, HttpStatus.BAD_REQUEST);
                console.log("Existing version has linkedNodeRoot, I will remoe it");
                version.linkedNodeRoot = null;
                await this.versionService.updateVersionAsync(version);
            }

            // init the single linked node root
            const n: NodeDto = {
                nodeId: null,
                elementVersion: null,
                nodes: new Array<INode>()
            };
            const versionModel = await this.versionService.createAndAddLinkedNodeToVersionAsync(version, n);

            const rootNode = await this.parseIterative(versionfile, versionModel.linkedNodeRoot);

            // console.log("Version to import:");
            // console.log(version);

            // no update of version needed here
            //const result = await this.versionService.updateVersionAsync(version);
            const newVersion = await this.versionService.getVersionDenormalizedAsync(versionId, 999);

            console.log("imported Version:");
            console.log(newVersion);

            return newVersion;
        }
        catch (err) {
            const msg = "Error importing version file for version";
            console.error(msg, err);
            throw new HttpException(msg, HttpStatus.BAD_REQUEST);
        }
    }

    async parseIterative(versionfile: string, linkedNodeRoot: INode): Promise<NodeDto> {

        try {
            const lines = versionfile.split(/[\r\n]+\t/);
            lines[0] = lines[0].substring(1); // trim leading \t of first line

            // path: path to current IParentElement, used to retrieve parents. path[0] is always VersionDto
            const path = new Array<INode>();
            path.push(linkedNodeRoot);
            // root: current root to push new elements to
            const root = () => path[path.length - 1];

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
                    if (isStructuringElement) path.length = Number.parseInt(type.substring(6)); // NOTE dirtyly get level from "Header123"

                    let e: ElementDto = {
                        elementId: elemId,
                        type: elemType,
                        elementVersions: new Array<IElementVersion>()
                    };
                    e = await this.elementService.getOrCreateElementAsync(e);

                    // NOTE appendElementVersionAsync could create Dto when given those 2 parameters
                    const v: ElementVersionDto = {
                        elementVersionId: null,
                        element: null,
                        order: elemOrder,
                        text: text,
                    };
                    const vModel = await this.elementService.appendElementVersionAsync(e.elementId, v);

                    const { rootModel, childModel } = await this.versionService.createAndAddLinkedNodeAsync(root(), vModel);
                    path[path.length - 1] = rootModel; // we must replace the object with the newly saved one
                    console.log(`pushed element ${elemType} ${elemId} to parent ${root().nodeId} `);

                    if (isStructuringElement) path.push(childModel);
                }
            }
            return linkedNodeRoot;
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
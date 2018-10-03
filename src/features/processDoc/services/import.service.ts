import { Injectable, Inject, HttpException, HttpStatus, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { Model } from 'mongoose';

import * as fs from 'fs';

import { ElementDto } from '../models/dtos/element.dto';
import { IVersionSchema } from '../database/interfaces/version.schema.interface';
import { ElementType } from '../../../../npm-interfaces/src/processDoc/elementtype.enum';
import { VersionService } from './version.service';
import { IVersion } from '../../../../npm-interfaces/src/processDoc/version.interface';
import { ElementVersionDto } from '../models/dtos/elementversion.dto';
import { NodeDto } from '../models/dtos/node.dto';
import { INode } from '../../../../npm-interfaces/src/processDoc/node.interface';
import { ElementService } from './element.service';
import { IElementVersion } from '../../../../npm-interfaces/src/processDoc/elementversion.interface';
import { Config } from '../../../environments/environments';

@Injectable()
export class ImportService {

    constructor(
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

            // NOTE we fetch fully populated version, so we can easily delete nodes in tree content if present
            let version: IVersionSchema = await this.versionService.getVersionSchemaAsync(versionId, Config.ASSUMED_MAXIMUM_VERSION_DEPTH);
            // const version: VersionDto = await this.versionService.getVersionNormalizedAsync(versionId, 0);

            console.log("Original version:");
            console.log(version);

            if (version.nodes && version.nodes.length > 0) {
                throw new UnprocessableEntityException("version.nodes is set, but shall not");
                // we won't deny an update, just remove all previously existing nodes
                // console.log("Existing version has treeNodes, I will remove them");
                // version.nodes = new Array<NodeDto>();
                // await this.versionService.updateVersionAsync(version);
            }

            if (version.linkedNodeRoot) {
                // we won't deny an update, just remove all previously existing nodes
                console.info("Removing node tree for version " + versionId);
                version = await this.versionService.removeLinkedNodeFromVersionAsync(version);
                // NOTE the above method does not only remove nodes, but also elementVersions, while keeping elements in the db
                // NOTE/TODO this may be replaced by an algorithm that keeps identical element(Versions) in place:
                // 1. a method getOrCreateElement (by ID identity) (call in parseIterative)
                // 2. a method getOrCreateVersion (by value identity) (call in parseIterative)
            }

            // init the single linked node root
            const n: NodeDto = {
                nodeId: null,
                elementVersion: null,
                nodes: new Array<INode>()
            };
            version = await this.versionService.createAndAddLinkedNodeToVersionAsync(version, n);

            console.info("Parsing source document for version " + versionId + " ... this may take a while.");
            const rootNode = await this.parseIterative(versionfile, version.linkedNodeRoot);

            // console.log("Version to import:");
            // console.log(version);

            // no update of version needed here
            //const result = await this.versionService.updateVersionAsync(version);
            const newVersion = await this.versionService.getVersionDenormalizedAsync(versionId, Config.ASSUMED_MAXIMUM_VERSION_DEPTH);

            console.log("Imported version:");
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

                    // NOTE appendElementVersionAsync will re-use existing elementVersion if matching
                    const v: ElementVersionDto = {
                        elementVersionId: null,
                        element: null,
                        order: elemOrder,
                        text: text,
                    };
                    const vModel = await this.elementService.appendElementVersionAsync(e.elementId, v);

                    const { rootModel, childModel } = await this.versionService.createAndAddLinkedNodeAsync(root(), vModel);
                    path[path.length - 1] = rootModel; // we must replace the object with the newly saved one
                    // console.log(`pushed element ${elemType} ${elemId} to parent ${root().nodeId} `);

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
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';

import * as fs from 'fs';

import { Observable, of } from 'rxjs';

import * as util from '../../../common/util/util';

import { VersionDto } from '../models/dtos/version.dto';
import { VersionFactory } from '../models/factories/version.factory';
import { IVersionSchema } from '../database/interfaces/version.schema.interface';
import { IVersion } from '../models/interfaces/version.interface';
import { INodeContainer } from '../models/interfaces/nodecontainer.interface';
import { INodeContainerSchema } from '../database/interfaces/nodecontainer.schema.interface';
import { ITreeNodeSchema } from '../database/interfaces/treenode.schema.interface';
import { TreeNodeSchema } from '../database/schemas/treenode.schema';
import { INode } from '../models/interfaces/node.interface';
import { ILinkedNodeSchema } from '../database/interfaces/linkednode.schema.interface.';
import { NodeDto } from '../models/dtos/node.dto';
import { IElementVersion } from '../models/interfaces/elementversion.interface';
import { ElementService } from './element.service';

@Injectable()
export class VersionService {

    constructor(
        @Inject('VersionModelToken') private readonly versionModel: Model<IVersionSchema>,
        @Inject('TreeNodeModelToken') private readonly treeNodeModel: Model<ITreeNodeSchema>,
        @Inject('LinkedNodeModelToken') private readonly linkedNodeModel: Model<ILinkedNodeSchema>,
        private elementService: ElementService) { }

    // "CRUD" version

    /**
     * Builds a mongoose populate object for Version/LinkedNode
     * @param depth The depth of the populate path. Numbers from 0 upwards are populated as expected. null is not allowed
     */
    private buildPopulateTree(depth: number): object {
        if (depth === 0) return { path: 'linkedNodeRoot' }; // NOTE a hack, since .populate() needs a non-empty object
        const list = [...Array(depth).keys()]; // https://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
        const reducer = (accu, current) => accu === null ?
            [
                { path: 'nodes' },
                { path: 'elementVersion', populate: { path: 'element' } }
            ] : [
                { path: 'nodes', populate: accu },
                { path: 'elementVersion', populate: { path: 'element' } }
            ];
        const internpop = list.reduce(reducer, null); // NOTE need 'null' since omitting initialValue equals 0
        const pop = { path: 'linkedNodeRoot', populate: internpop };
        return pop;
    }

    async getAllVersionsAsync(depth: number): Promise<IVersion[]> {
        const res = await this.versionModel.find().populate(this.buildPopulateTree(depth));

        if (res == null)
            return null;

        return of(res.map(v => VersionFactory.create(v))).toPromise();
    }

    async getVersionSchemaAsync(versionId: string, depth: number): Promise<IVersionSchema> {
        const query = { versionId: versionId };
        const res = await this.versionModel.findOne(query).populate(this.buildPopulateTree(depth));

        if (res == null)
            throw new HttpException(`VersionDto with Id: ${versionId} not found`, HttpStatus.BAD_REQUEST);

        return res;
    }

    async getVersionAsync(versionId: string, depth: number): Promise<IVersion> {
        return of(VersionFactory.create(await this.getVersionSchemaAsync(versionId, depth))).toPromise();
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
            throw new HttpException("Error in creating version: " + error, HttpStatus.I_AM_A_TEAPOT);
        }
    }

    async updateVersionAsync(version: IVersion): Promise<IVersion> {
        if (!version.versionId || version.versionId.length === 0)
            throw new HttpException("Can't fetch version, no versionId supplied", HttpStatus.BAD_REQUEST);

        const query = { versionId: version.versionId };

        const model = await this.versionModel.findOne(query);

        // TODO set some values... e.g. the complete tree (?!)
        // think about it ... do we even need an update?
        model.published = version.published;

        model.nodes = version.nodes.map(n => new this.treeNodeModel(n));
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
            const sourceNodeModel = new this.treeNodeModel(sourceNode);
            targetNodeContainerModel.nodes.push(sourceNodeModel);
            const targetNodeModel = targetNodeContainerModel.nodes[targetNodeContainerModel.nodes.length - 1];
            this.pushTreeIteratively(targetNodeModel, sourceNode);
        }
    }

    // end "CRUD" version

    // "CRUD" nodes

    private async createLinkedNodeSchemaAsync(node: INode): Promise<ILinkedNodeSchema> {
        try {
            if (node.nodeId && node.nodeId.length)
                throw new HttpException("Can't create new node, dto has nodeId", HttpStatus.BAD_REQUEST);

            const model = new this.linkedNodeModel(node);
            model.nodeId = util.getId();

            const res = await model.save();

            console.log(`new NodeDto ${model.nodeId} saved`);
            // console.log(res);

            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async createLinkedNodeAsync(node: INode): Promise<INode> {
        return of(VersionFactory.createLinkedNode(await this.createLinkedNodeSchemaAsync(node))).toPromise();
    }

    private async getLinkedNodeSchemaAsync(nodeId: string): Promise<ILinkedNodeSchema> {
        const query = { nodeId: nodeId };
        const res = await this.linkedNodeModel.findOne(query);

        if (res == null)
            throw new HttpException(`LinkedNodeDto with Id: ${nodeId} not found`, HttpStatus.BAD_REQUEST);

        return res;
    }

    async getLinkedNodeAsync(nodeId: string): Promise<INode> {
        return of(VersionFactory.createLinkedNode(await this.getLinkedNodeSchemaAsync(nodeId))).toPromise();
    }

    // async getOrCreateLinkedNodeAsync(nodeId: string): Promise<INode> {
    //     let res = null as NodeDto;
    //     try {
    //         res = await this.getLinkedNodeAsync(element.elementId);
    //     } catch (HttpException) {
    //         res = await this.createElementAsync(element);
    //     }
    //     // NOTE TODO Promise.resolve(res)? or is this wrapped automatically? both methods (get, create) return Promise thus it's sufficient
    //     return res;
    // }

    async createAndAddLinkedNodeToVersionAsync(version: IVersion, node: INode): Promise<IVersion> {
        const vModel = await this.getVersionSchemaAsync(version.versionId, 0);
        const nModel = await this.createLinkedNodeSchemaAsync(node);

        vModel.linkedNodeRoot = nModel;
        const res = await vModel.save();
        return of(VersionFactory.create(vModel)).toPromise();
    }

    async createAndAddLinkedNodeAsync(nodeContainer: INode, elementVersion: IElementVersion): Promise<{ rootModel: INode, childModel: INode }> {
        let ncModel = await this.getLinkedNodeSchemaAsync(nodeContainer.nodeId);

        const n: NodeDto = {
            nodeId: null,
            elementVersion: null,
            nodes: new Array<INode>()
        };
        let nModel = await this.createLinkedNodeSchemaAsync(n);

        const evModel = await this.elementService.getElementVersionSchemaAsync(elementVersion.elementVersionId);
        nModel.elementVersion = evModel;
        nModel = await nModel.save();

        ncModel.nodes.push(nModel);
        ncModel = await ncModel.save();
        return of({
            rootModel: VersionFactory.createLinkedNode(ncModel),
            childModel: VersionFactory.createLinkedNode(nModel)
        }).toPromise();
    }
}
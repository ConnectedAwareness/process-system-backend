import { Injectable, Inject, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { Model, version } from 'mongoose';

import { Observable, of } from 'rxjs';

import * as util from '../../../common/util/util';

import { VersionFactory } from '../models/factories/version.factory';
import { IVersionSchema } from '../database/interfaces/version.schema.interface';
import { IVersion } from '../../../../npm-interfaces/src/processDoc/version.interface';
import { INodeContainer } from '../../../../npm-interfaces/src/processDoc/nodecontainer.interface';
import { INodeContainerSchema } from '../database/interfaces/nodecontainer.schema.interface';
import { ITreeNodeSchema } from '../database/interfaces/treenode.schema.interface';
import { INode } from '../../../../npm-interfaces/src/processDoc/node.interface';
import { ILinkedNodeSchema } from '../database/interfaces/linkednode.schema.interface.';
import { NodeDto } from '../models/dtos/node.dto';
import { IElementVersion } from '../../../../npm-interfaces/src/processDoc/elementversion.interface';
import { ElementService } from './element.service';
import { TokenNames } from '../../../common/util/constants';

@Injectable()
export class VersionService {

    constructor(
        @Inject(TokenNames.VersionModelToken) private readonly versionModel: Model<IVersionSchema>,
        @Inject("TreeNodeModelToken") private readonly treeNodeModel: Model<ITreeNodeSchema>, // NOTE maybe not needed
        @Inject(TokenNames.LinkedNodeModelToken) private readonly linkedNodeModel: Model<ILinkedNodeSchema>,
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

    async getAllVersionsAsync(skip: number = 0, limit: number = 0): Promise<IVersion[]> {
        let res: Array<IVersionSchema> = null;

        if (skip > 0 && limit > 0)
            res = await this.versionModel.find()
                .limit(limit)
                .skip(skip * limit)
                .sort('versionId')
                //.populate(this.buildPopulateTree(depth))
                .exec();
        else if (limit > 0)
            res = await this.versionModel.find()
                .limit(limit)
                .sort('versionId')
                //.populate(this.buildPopulateTree(depth))
                .exec();
        else
            res = await this.versionModel.find()
                .sort('versionId');
                //.populate(this.buildPopulateTree(depth));

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

    // TODO check whether both of them are truly required...
    async getVersionDenormalizedAsync(versionId: string, depth: number): Promise<IVersion> {
        return of(VersionFactory.create(await this.getVersionSchemaAsync(versionId, depth))).toPromise();
    }
    async getVersionNormalizedAsync(versionId: string, depth: number): Promise<IVersion> {
        return of(VersionFactory.create(await this.getVersionSchemaAsync(versionId, depth), false)).toPromise();
    }

    public async createVersionAsync(version: IVersion): Promise<IVersion> {
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

    public async updateVersionAsync(versionId: string, version: IVersion): Promise<IVersion> {
        if (!versionId || versionId.length === 0)
            throw new HttpException("Can't fetch version, no versionId supplied", HttpStatus.BAD_REQUEST);

        try {
            const query = { versionId: versionId };

            const model = await this.versionModel.findOne(query);

            // TODO set some values... e.g. the complete tree (?!)
            // think about it ... do we even need an update?

            model.nodes = version.nodes.map(n => new this.treeNodeModel(n));
            // // first reset nodes in model
            // model.nodes = new Array<INodeSchema>();
            // // then copy tree -- NOTE we must iterate through the complete tree, since mongo's push() replaces/wraps given obj by EmbeddedObject
            // this.pushTreeIteratively(model, version);

            const res = await model.save();

            console.log("Version updated:");
            console.log(res);

            return of(VersionFactory.create(res)).toPromise();
        }
        catch (err) {
            const msg = `Error updating version with versionId ${versionId}`;
            console.error(msg, err);
            throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async publishVersionAsync(versionId: string, publish: boolean): Promise<boolean> {
        if (!versionId || versionId.length === 0)
            throw new HttpException("Can't fetch version, no versionId supplied", HttpStatus.BAD_REQUEST);

        try {
            const query = { versionId: versionId };

            const model = await this.versionModel.findOne(query);

            // TODO set some values... e.g. the complete tree (?!)
            // think about it ... do we even need an update?
            model.published = publish;

            const res = await model.save();

            console.log("Version published", res);

            return of(true).toPromise();
        }
        catch (err) {
            const msg = `Error publishing version with versionId ${versionId}`;
            console.error(msg, err);
            throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

            // console.log(`new NodeDto ${model.nodeId} saved`);
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

    async createAndAddLinkedNodeToVersionAsync(version: IVersionSchema, node: INode): Promise<IVersionSchema> {
        const vModel = await this.getVersionSchemaAsync(version.versionId, 0);
        const nModel = await this.createLinkedNodeSchemaAsync(node);

        vModel.linkedNodeRoot = nModel;
        const res = await vModel.save();
        return of(vModel).toPromise();
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

    async removeLinkedNodeFromVersionAsync(version: IVersionSchema): Promise<IVersionSchema> {
        // inspired by https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
        const flatten = (arr, result = []) => {
            for (const value of arr) {
                result.push(value);
                flatten(value.nodes, result);
            }
            return result;
        };

        const nodes = flatten(version.linkedNodeRoot.nodes);
        nodes.unshift(version.linkedNodeRoot);
        nodes.forEach(n => n.remove());

        version.linkedNodeRoot = null;
        await this.updateVersionAsync(version.versionId, version);

        return Promise.resolve(version);
    }

    async deleteAllVersionsAsync(): Promise<boolean> {
        await this.linkedNodeModel.collection.remove({});
        await this.treeNodeModel.collection.remove({}); // NOTE maybe not needed
        await this.versionModel.collection.remove({});
        return Promise.resolve(true);
    }
}
import * as util from '../../../../common/util/util';

import { VersionDto } from '../dtos/version.dto';
import { IVersionSchema } from '../../database/interfaces/version.schema.interface';
import { ILinkedNodeSchema } from '../../database/interfaces/linkednode.schema.interface.';
import { NodeDto } from '../dtos/node.dto';
import { ElementFactory } from './element.factory';
import { ObjectID } from 'bson';

export class VersionFactory {
    public static create(model: IVersionSchema) {
        const version = util.mapDto(model, VersionDto);

        version.linkedNodeRoot = VersionFactory.createLinkedNodeRecursive(model.linkedNodeRoot);

        return version;
    }

    public static generateFromJson(data) : VersionDto {
        //data.versionId = util.getId();
        const document = new VersionDto();
        Object.assign(document, data);

        return document;
    }

    public static createLinkedNodeRecursive(model: ILinkedNodeSchema) {
        if (!model) return null;
        if (model instanceof ObjectID) return null; // NOTE only necessary if we keep version-get-depth, leads to parent's .nodes of [null, null, ...]

        const node = util.mapDto(model, NodeDto);

        // node.nodes = new Array<INode>();
        node.nodes = model.nodes.map(m => VersionFactory.createLinkedNodeRecursive(m));
        node.elementVersion = ElementFactory.createElementVersion(model.elementVersion); // NOTE non-null test in createElementVersion

        return node;
    }

    public static createLinkedNode(model: ILinkedNodeSchema) {
        return util.mapDto(model, NodeDto);
    }
}
import { v4 } from 'uuid';

import * as util from '../../../../common/util/util';

import { VersionDto } from '../dtos/version.dto';
import { IVersionSchema } from '../../database/interfaces/version.schema.interface';
import { ILinkedNodeSchema } from '../../database/interfaces/linkednode.schema.interface.';
import { NodeDto } from '../dtos/node.dto';

export class VersionFactory {
    public static create(model: IVersionSchema) {
        return util.mapDto(model, VersionDto);
    }

    public static generateFromJson(data) : VersionDto {
        //data.versionId = util.getId();
        const document = new VersionDto();
        Object.assign(document, data);

        return document;
    }

    public static createLinkedNode(model: ILinkedNodeSchema) {
        return util.mapDto(model, NodeDto);
    }
}
import { v4 } from 'uuid';

import { VersionDto } from '../dtos/version.dto';
import { IVersionSchema } from '../../database/interfaces/version.schema.interface';
import { mapDto } from '../../../../main/util/util';
import { ILinkedNodeSchema } from '../../database/interfaces/linkednode.schema.interface.';
import { NodeDto } from '../dtos/node.dto';

export class VersionFactory {
    public static create(model: IVersionSchema) {
        return mapDto(model, VersionDto);
    }

    public static generateFromJson(data) : VersionDto {
        //data.versionId = v4();
        const document = new VersionDto();
        Object.assign(document, data);

        return document;
    }

    public static createLinkedNode(model: ILinkedNodeSchema) {
        return mapDto(model, NodeDto);
    }

    public static getLinkedNodeId(): string {
        return v4();
    }
}
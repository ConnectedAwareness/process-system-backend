import { v4 } from 'uuid';

import * as util from '../../../../common/util/util';

import { ElementDto } from '../dtos/element.dto';
import { IElementSchema } from '../../database/interfaces/element.schema.interface';
import { ElementVersionDto } from '../dtos/elementversion.dto';
import { IElementVersionSchema } from '../../database/interfaces/elementversion.schema.interface';

export class ElementFactory {
    public static createElement(model: IElementSchema) {
        return util.mapDto(model, ElementDto);
    }

    public static generateElementFromJson(data) : ElementDto {
        //data.versionId = util.getId();
        const element = new ElementDto();
        Object.assign(element, data);

        return element;
    }

    public static createElementVersion(model: IElementVersionSchema) {
        return util.mapDto(model, ElementVersionDto);
    }

    public static generateElementVersionFromJson(data) : ElementVersionDto {
        //data.versionId = util.getId();
        const element = new ElementVersionDto();
        Object.assign(element, data);

        return element;
    }
}
import * as util from '../../../../common/util/util';

import { ElementDto } from '../dtos/element.dto';
import { IElementSchema } from '../../database/interfaces/element.schema.interface';
import { ElementVersionDto } from '../dtos/elementversion.dto';
import { IElementVersionSchema } from '../../database/interfaces/elementversion.schema.interface';
import { ObjectID } from 'bson';

export class ElementFactory {
    public static createElement(model: IElementSchema) {
        return util.mapDto(model, ElementDto);
        // TODO recursively add ElementVersion DTOs, as far as they have been resolved (are not instanceof ObjectID)
    }

    public static generateElementFromJson(data) : ElementDto {
        //data.versionId = util.getId();
        const element = new ElementDto();
        Object.assign(element, data);

        return element;
    }

    public static createElementVersion(model: IElementVersionSchema) {
        if (!model) return null;
        const ev = util.mapDto(model, ElementVersionDto);

        if (!model.element || model.element instanceof ObjectID)
            ev.element = null;
        else
            ev.element = this.createElement(model.element);

        return ev;
    }

    public static generateElementVersionFromJson(data) : ElementVersionDto {
        //data.versionId = util.getId();
        const element = new ElementVersionDto();
        Object.assign(element, data);

        return element;
    }
}
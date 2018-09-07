import { v4 } from 'uuid';

import { mapDto } from '../../../../main/util/util';
import { ElementDto } from '../dtos/element.dto';
import { IElementSchema } from '../../database/interfaces/element.schema.interface';
import { ElementVersionDto } from '../dtos/elementversion.dto';
import { IElementVersionSchema } from '../../database/interfaces/elementversion.schema.interface';

export class ElementFactory {
    public static createElement(model: IElementSchema) {
        return mapDto(model, ElementDto);
    }

    public static generateElementFromJson(data) : ElementDto {
        //data.versionId = v4();
        const element = new ElementDto();
        Object.assign(element, data);

        return element;
    }

    public static createElementVersion(model: IElementVersionSchema) {
        return mapDto(model, ElementVersionDto);
    }

    public static generateElementVersionFromJson(data) : ElementVersionDto {
        //data.versionId = v4();
        const element = new ElementVersionDto();
        Object.assign(element, data);

        return element;
    }

    public static getElementVersionId(): string {
        return v4();
    }
}
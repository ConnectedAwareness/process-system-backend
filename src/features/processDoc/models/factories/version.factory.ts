import { VersionDto } from '../dtos/version.dto';
import { IVersionSchema } from '../../database/interfaces/version.schema.interface';
import { mapDto } from '../../../../main/util/util';

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
}
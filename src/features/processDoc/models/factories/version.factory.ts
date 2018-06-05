import { VersionDto } from '../dtos/version.dto';
import { IVersion } from '../interfaces/version.interface';
import { ElementDto } from '../dtos/element.dto';
import { IElement } from '../interfaces/element.interface';
import { mapDto } from '../../../../main/util/util';

export class VersionFactory {
    public static create(model: IVersion) {
        return mapDto(model, VersionDto);
    }

    public static generateFromJson(data) : VersionDto {
        //data.versionId = v4();
        let version = Object.create(VersionDto.prototype) as VersionDto;
        version =  Object.assign(data, JSON, {});

        return version;
    }
}
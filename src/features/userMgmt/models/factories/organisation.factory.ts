import { v4 } from 'uuid';

import { OrganisationDto } from '../dtos/organisation.dto';
import { IOrganisation } from '../interfaces/organisation.interface';
import { mapDto } from '../../../../main/util/util';

export class OrganisationFactory {
    public static create(model: IOrganisation) {
        return mapDto(model, OrganisationDto);
    }

    public static generateFromJson(data) : OrganisationDto {
        //data.organisationId = v4();
        let organisation = Object.create(OrganisationDto.prototype) as OrganisationDto;
        organisation =  Object.assign(data, JSON, {});

        return organisation;
    }

    public static getId() : string {
        return v4();
    }
}
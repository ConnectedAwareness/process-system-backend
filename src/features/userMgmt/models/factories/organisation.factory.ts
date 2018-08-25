import { v4 } from 'uuid';

import { OrganisationDto } from '../dtos/organisation.dto';
import { IOrganisationSchema } from '../../database/interfaces/organisation.schema.interface';
import { mapDto } from '../../../../main/util/util';
import { IOrganisation } from '../interfaces/organisation.interface';
import { IRoleOfUser } from '../interfaces/roleofuser.interface';

export class OrganisationFactory {
    public static createOrganisation(model: IOrganisationSchema) {
        return mapDto(model, OrganisationDto);
    }

    public static generateOrganisationFromJson(data) : IOrganisation {
        //data.organisationId = v4();
        const organisation = new OrganisationDto();
        Object.assign(organisation, data);

        return organisation;
    }

    public static getId() : string {
        return v4();
    }
}
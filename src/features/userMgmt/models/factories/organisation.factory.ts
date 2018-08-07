import { v4 } from 'uuid';

import { OrganisationDto } from '../dtos/organisation.dto';
import { IOrganisationSchema } from '../../database/interfaces/organisation.schema.interface';
import { mapDto } from '../../../../main/util/util';
import { IUserSchema } from '../../database/interfaces/user.schema.interface';
import { IOrganisation } from '../interfaces/organisation.interface';

export class OrganisationFactory {
    public static create(model: IOrganisationSchema, includeUser: boolean) {
        if (!includeUser)
            model.users = new Array<IUserSchema>();

        return mapDto(model, OrganisationDto);
    }

    public static generateFromJson(data) : IOrganisation {
        //data.organisationId = v4();
        let organisation = Object.create(OrganisationDto.prototype) as IOrganisation;
        organisation =  Object.assign(data, JSON, {});

        return organisation;
    }

    public static getId() : string {
        return v4();
    }
}
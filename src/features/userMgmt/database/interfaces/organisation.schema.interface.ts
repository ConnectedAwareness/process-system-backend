import { Document, Schema } from 'mongoose';

import { IOrganisation } from "../../models/interfaces/organisation.interface";

export interface IOrganisationSchema extends Document, IOrganisation {
}
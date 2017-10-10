import { User } from './user';
export class Connectee extends User {

  public static parse(
    obj: { id: number, name: string, password: string, organisation_id: number }
  ): Connectee {
    return new Connectee(
      obj.id,
      obj.name,
      obj.password,
      obj.organisation_id
    );
  }

  constructor(id: number, name: string, password: string, private organisatioId: number) {
    super(id, name, password);
  }
}

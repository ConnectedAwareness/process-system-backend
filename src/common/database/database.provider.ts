import * as mongoose from 'mongoose';

import { Config } from '../../environments/environments';

export function dbConnection() {
  let res;
  if (Config.DB_USER && Config.DB_PW){
    res = `mongodb://${Config.DB_USER}:${Config.DB_PW}@${Config.DB_HOST}:${Config.DB_PORT}/${Config.DB_NAME}`;
  }
  else{
    res = `mongodb://${Config.DB_HOST}:${Config.DB_PORT}/${Config.DB_NAME}`;
  }
  console.info(`configured DB: ${res}`);
  return res;
}

export const databaseProvider = [
  {
    provide: 'DbConnectionToken',
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect(dbConnection()),
  },
];
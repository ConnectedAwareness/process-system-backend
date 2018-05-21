import * as mongoose from 'mongoose';

import { DBConfig } from '../../environments/environments.dev';

export function dbConnection() {
  let res;
  if (DBConfig.DB_USER && DBConfig.DB_PW){
    res = `mongodb://${DBConfig.DB_USER}:${DBConfig.DB_PW}@${DBConfig.DB_HOST}:${DBConfig.DB_PORT}/${DBConfig.DB_NAME}`;
  }
  else{
    res = `mongodb://${DBConfig.DB_HOST}:${DBConfig.DB_PORT}/${DBConfig.DB_NAME}`;
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
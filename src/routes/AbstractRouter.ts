import { Router, Request, Response, NextFunction } from 'express';
import { IConnection, createConnection } from 'mysql';

export abstract class AbstractRouter {

  public router: Router;
  protected con: IConnection;

  constructor(){
    this.router = Router();
    this.con = createConnection({
      host: "localhost",
      user: "root",
      database: "conawa"
    });
  }

  abstract init();
  getRouter(){
    return this.router;
  }
}

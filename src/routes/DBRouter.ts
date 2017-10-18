import { Router, Request, Response, NextFunction } from 'express';
import { IConnection, createConnection } from 'mysql';

const db = {
  host: "localhost",
  user: "root",
  database: "awarenessplatform"
};
const userTypes = [
  'connectee',
  'admin',
  'connector',
  'integrator',
  'coordinator'
]
const tokenTimer = 20000;

export class DBRouter {

  public static con: IConnection;
  router: Router;

  public static validateUserType(type: string): boolean{
    for(let i = 0; i<userTypes.length; i++){
      if(userTypes[i]===type) return true
    }
    return false;
  }

  /**
   * Initialize the DBRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  connect(req: Request, res: Response, next: NextFunction) {
    console.log('connected');
    DBRouter.con= createConnection(db);
    DBRouter.con.connect(err=>{
      if(err) res.status(400).send(err.message);
      else next();
    })
  }

  init() {
    this.router.use('', this.connect);
  }
}

export default new DBRouter().router;
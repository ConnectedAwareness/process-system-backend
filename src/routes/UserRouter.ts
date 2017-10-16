import { Router, Request, Response, NextFunction } from 'express';
import { IConnection, createConnection } from 'mysql';

export class UserRouter{
  router: Router;

  private con: IConnection = createConnection({
    host: "localhost",
    user: "root",
    database: "conawa"
  });
  /**
   * Initialize the UserRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public getUsers(req: Request, res: Response, next: NextFunction) {

    let con = createConnection({
      host: "localhost",
      user: "root",
      database: "conawa"
    });
    con.connect((err) => {
      if (err) {
        res.status(400).send(err);
      } else {
        con.query('SELECT `id`, `name`, `registration_version` FROM `person`', (err, result, fields) => {
          if (err) {
            res.status(500).send(err);
          } else {
            
            res.status(200).send(result);
          }
        });
      }
    });
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    /**
     * first param = subpath
     * second param = called function
     */
    this.router.get('/', this.getUsers);
  }

}

// Create the UserRouter, and export its configured Express.Router
export default new UserRouter().router;

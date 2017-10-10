import { Connectee } from './../classes/users/connectee';
import { Router, Request, Response, NextFunction } from 'express';
import { IConnection, createConnection } from 'mysql';
import { sign } from 'jsonwebtoken';
import { Config } from './../config';

export class LoginRouter {
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

  postLogin(req: Request, res: Response, next: NextFunction) {
    let con = createConnection({
      host: "localhost",
      user: "root",
      database: "conawa"
    });
    con.connect((err) => {
      if (err) {
        res.status(400).send(err);
      } else {
        con.query('SELECT * FROM connectee INNER JOIN person ON person.id=connectee.id WHERE person.name = "' + req.body.name + '" AND person.password="' + req.body.password + '"', (err, result, fields) => {
          if (err) {
            res.json({ success: false, message: err.message });
          } else {
            if (result.length === 0) {
              res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else {
              res.json({
                success: true,
                message: 'Enjoy your token!',
                token: sign({ test: Connectee.parse(result[0]) }, Config.tokenKey, { expiresIn: 1440 })
              });
            }
          }
        });
      }
    });

    // res.status(200).send('login');
  }

  init() {
    this.router.post('/', this.postLogin);
  }
}

const loginRouter = new LoginRouter();
loginRouter.init();

export default loginRouter.router;
import { DBRouter } from './DBRouter';
import { Token } from './../classes/token/token';
import { Connectee } from './../classes/users/connectee';
import { Router, Request, Response, NextFunction } from 'express';
import { IConnection, createConnection, IError } from 'mysql';
import { sign } from 'jsonwebtoken';
import { Config } from './../config';
import * as CryptoJS from 'crypto-js';

const serverKey = 'testKey'
const tokenTimer = 2 * 60 * 1000;

export class LoginRouter {
  router: Router;

  public static isSingleUser(result: any, res: Response, err?: IError) {
    if (err) res.json({ success: false, message: err.message });
    else if (result.length === 0) res.json({ success: false, message: 'User does not exist!' });
    else if (result.length > 1) res.json({ success: false, message: 'To many Users!' });
    else return true;
    return false;
  }

  public static logout(req: Request, res: Response, id: number) {
    DBRouter.con.query(
      'UPDATE user SET `login_token` = NULL, `login_time` = NULL WHERE `user`.`user_id` = ' + id,
      (err, result) => {
        if (err) res.json({ success: false, message: 'Error: ' + err });
        else res.json({ success: true, message: 'Token deleted!' });
      }
    );
  }

  /**
   * Initialize the LoginRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  postLogin(req: Request, res: Response, next: NextFunction) {
    // TODO: validate request parameters
    console.log(DBRouter.validateUserType(req.body.usertype));
    
    if (DBRouter.validateUserType(req.body.usertype)) {
      const sql = 'Select * From user INNER JOIN ' + req.body.usertype +
        ' ON user.user_id=' + req.body.usertype + '.user_id WHERE name = "' + req.body.name +
        '" AND password="' + req.body.password + '"';

      DBRouter.con.query(sql, (err, result, fields) => {
        if (LoginRouter.isSingleUser(result, res, err)) {
          const time = new Date().getTime();
          const token = CryptoJS.AES.encrypt(time + ' ' + result[0].user_id, serverKey).toString();
          const sql = "UPDATE user SET login_token = '" + token + "', `login_time` = " + time + " WHERE `user`.`user_id` = " + result[0].user_id + ";";
          DBRouter.con.query(sql, function (err, result) {
            if (err) res.status(400).send(err);
            else
              res.json({ success: true, message: 'Enjoy your token!', token: token });
          });
        }
      });
    } else {
      res.json({ success: false, message: 'Invalid user type!' });
    }
  }

  checkToken(req: Request, res: Response, next: NextFunction) {
    // TODO: validate request parameters
    if (DBRouter.validateUserType(req.body.usertype)) {
      const sql = 'SELECT * FROM `user` INNER JOIN `' + req.body.usertype + '` ON `user`.`user_id`=`' + req.body.type + '`.`user_id` WHERE `user`.`login_token`="' + req.body.token + '"';
      DBRouter.con.query(sql, (err, result, fields) => {
        if (LoginRouter.isSingleUser(result, res, err)) {
          if (new Date().getTime() - result[0].login_time < tokenTimer) {
            const sql = 'UPDATE user SET `login_time` = ' + new Date().getTime() + ' WHERE `user`.`user_id` = ' + result[0].user_id;
            DBRouter.con.query(sql, (err, result) => {
              if (err) res.status(400).send(err);
              else next();
            });
          } else {
            LoginRouter.logout(req, res, result[0].user_id);
          }
        }
      });
    } else {
      res.json({ success: false, message: 'Invalid user type!' });
    }
  }

  init() {
    this.router.post('/', this.postLogin);
    this.router.use('/', this.checkToken);
  }
}

export default new LoginRouter().router;
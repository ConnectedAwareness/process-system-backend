import { DBRouter } from './DBRouter';
import { Token } from './../classes/token/token';
import { Connectee } from './../classes/users/connectee';
import { Router, Request, Response, NextFunction } from 'express';
import { IConnection, createConnection } from 'mysql';
import { sign } from 'jsonwebtoken';
import { Config } from './../config';
import * as CryptoJS from 'crypto-js';

const serverKey = 'testKey'
const db = {
  host: "localhost",
  user: "root",
  database: "awarenessplatform"
};
const tokenTimer = 20000;

export class LoginRouter {
  router: Router;

  /**
   * Initialize the LoginRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  postLogin(req: Request, res: Response, next: NextFunction) {
    // TODO: validate request parameters
    DBRouter.con.query('SELECT * FROM user WHERE name = "' + req.body.name + '" AND password="' + req.body.password + '"', (err, result, fields) => {
      if (err) {
        res.json({ success: false, message: err.message });
      } else if (result.length === 0) {
        res.json({ success: false, message: 'Authentication failed: User not found!' });
      } else if (result.length > 1) {
        res.json({ success: false, message: 'System error: User exists' + result.length + ' times!' });
      } else {
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
  }

  testToken(req: Request, res: Response, next: NextFunction) {
    // TODO: validate request parameters
    const sql = 'SELECT * FROM `user` INNER JOIN `' + req.body.type + '` ON `user`.`user_id`=`' + req.body.type + '`.`user_id` WHERE `user`.`login_token`="' + req.body.token + '"';
    DBRouter.con.query(sql, (err, result, fields) => {
      if (err) {
        res.json({ success: false, message: err.message });
      } else if (result.length === 0) {
        res.json({ success: false, message: 'Authentication failed: Token not found!' });
      } else if (result.length > 1) {
        res.json({ success: false, message: 'System error: User exists' + result.length + ' times!' });
      } else if (new Date().getTime() - result[0].login_time < tokenTimer) {
        const sql = 'UPDATE user SET `login_time` = ' + new Date().getTime() + ' WHERE `user`.`user_id` = ' + result[0].user_id;
        DBRouter.con.query(sql, function (err, result) {
          if (err) res.status(400).send(err);
          else
            res.json({ success: true, message: 'Time updated!' });
        });
      } else {
        const sql = 'UPDATE user SET `login_token` = NULL, `login_time` = NULL WHERE `user`.`user_id` = ' + result[0].user_id;
        DBRouter.con.query(sql, function (err, result) {
          if (err) res.json({ success: false, message: 'Error: ' + err });
          else res.json({ success: true, message: 'Token deleted!' });
        });
      }
    });
  }

  init() {
    this.router.post('/', this.postLogin);
    this.router.use('/', this.testToken);
  }
}

export default new LoginRouter().router;
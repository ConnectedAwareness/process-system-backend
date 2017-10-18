import DBRouter from './routes/DBRouter';
import * as path from 'path';
import { Config } from "./config";
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as mysql from 'mysql';

import UserRouter from './routes/UserRouter';
import LoginRouter from './routes/LoginRouter';

import { verify } from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(function (req, res, next) {
      
          // Website you wish to allow to connect
          res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
      
          // Request methods you wish to allow
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      
          // Request headers you wish to allow
          res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      
          // Set to true if you need the website to include cookies in the requests sent
          // to the API (e.g. in case you use sessions)
          // res.setHeader('Access-Control-Allow-Credentials', true);
      
          // Pass to next layer of middleware
          next();
      });
  }

  // private makeid(size: number): string {
  //   let text = "";
  //   let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //   for (let i = 0; i < 20; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  //   return text;
  // }
  // Configure API endpoints.
  private routes(): void {
    // this.express.post('/key', (req, res, next) => {
    //   let clientkey = this.makeid(20);
    //   let serverkey = this.makeid(20);
    //   let encr1 = CryptoJS.AES.encrypt('Ammon-Mino Stretz', clientkey);
    //   let encr1String = encr1.toString();
    //   let encr2 = CryptoJS.AES.encrypt(encr1String, serverkey);
    //   let decr1 = CryptoJS.AES.decrypt(encr2, serverkey);
    //   let decr1String = decr1.toString(CryptoJS.enc.Utf8);
    //   let decr2 = CryptoJS.AES.decrypt(decr1String, clientkey);
    //   res.status(200).send(' '+decr2.toString(CryptoJS.enc.Utf8));
    // })
    this.express.use('',DBRouter);
    this.express.use('/login', LoginRouter);
    this.express.use('', LoginRouter);
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    this.express.use('/users', UserRouter);
    this.express.use((req, res) => {
      res.status(403).send({ success: false, message: req.headers.decoded });
    })
  }

}

export default new App().express;

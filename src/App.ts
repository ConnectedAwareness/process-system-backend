import * as path from 'path';
import { Config } from "./config";
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as mysql from 'mysql';

import UserRouter from './routes/UserRouter';
import LoginRouter from './routes/LoginRouter';
import { verify } from 'jsonwebtoken';

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
  }

  // Configure API endpoints.
  private routes(): void {
    this.express.use('/login', LoginRouter);
    this.express.use((req, res, next)=>{
      const token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
          verify(token, Config.tokenKey, (err, decoded)=> {      
            if (err) {
              return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
              req.headers.decoded=decoded;
              // next();
              res.status(403).send({ success: true, message: decoded});
            }
          });
        } else {
          return res.status(403).send({ success: false, message: 'No token provided.'});
        }
    });
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    this.express.use('/users', UserRouter);
    this.express.use((req, res)=>{
      res.status(404).send('No valid request!');
    })
  }

}

export default new App().express;

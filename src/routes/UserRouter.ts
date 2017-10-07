import {Router, Request, Response, NextFunction} from 'express';

export class UserRouter {
  router: Router

  /**
   * Initialize the UserRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public getUsers(req: Request, res: Response, next: NextFunction) {
      res.status(200).send('It works!');
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
const UserRoutes = new UserRouter();
UserRoutes.init();

export default UserRoutes.router;

import {NextFunction, Request, Response} from "express";

export interface FormioAuth {
  currentUser: any;

  /**
   * Middleware responsible to generate the temporary token
   * @param req
   * @param res
   * @param next
   */
  tempToken(req: Request, res: Response, next: NextFunction): void;

  /**
   * Interception logout request.
   * @param req
   * @param res
   * @param next
   */
  logout(req: Request, res: Response, next: NextFunction): void;
}

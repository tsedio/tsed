import {NextFunction, Request, Response} from "express";
import {Db} from "mongodb";

import {Formio} from "./Formio.js";

export interface FormioUpdate {
  db: Db;
  version: string;

  /**
   *
   * @param cb
   */
  initialize(cb: (err: unknown, db: any) => void): Promise<Formio>;

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  sanityCheck(req: Request, res: Response, next: NextFunction): void;
}

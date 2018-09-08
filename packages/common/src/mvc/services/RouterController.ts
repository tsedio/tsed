import * as Express from "express";

/**
 * RouteController give the express Router use by the decorated controller.
 * @deprecated Use ExpressRouter insteadof.
 */
export class RouterController {
  constructor(private router: Express.Router) {}

  /**
   * Return the Express.Router.
   * @deprecated Use ExpressRouter insteadof.
   * @returns {Express.Router}
   */
  public getRouter(): Express.Router {
    return this.router;
  }
}

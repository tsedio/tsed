import * as Express from "express";
/**
 * RouteController give the express Router use by the decorated controller.
 */
export default class RouterController {

    constructor(private router: Express.Router) {

    }

    /**
     * Return the Express.Router.
     * @returns {Express.Router}
     */
    public getRouter(): Express.Router {
        return this.router;
    }
}

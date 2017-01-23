import * as Express from "express";

import ParseService from "./parse";
import RequestService from "./request";
import InjectorService from "./injector";
import RouteService from "./route";
import ConverterService from "./converter";
import MiddlewareService from "./middleware";

/**
 * RouteController give the express Router use by the decorated controller.
 */
class RouterController {

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

export {
    ParseService,
    RequestService,
    InjectorService,
    MiddlewareService,
    RouteService,
    RouterController,
    ConverterService
};

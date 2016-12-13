import * as Express from 'express';

import ParseService from "./parse";
import RequestService from "./request";
import InjectorService from "./injector";
import RouteService from "./route";

class RouterController {
    constructor(private router: Express.Router) {

    }

    public getRouter(): Express.Router {
        return this.router;
    }
}

export {
    ParseService,
    RequestService,
    InjectorService,
    RouteService,
    RouterController
};

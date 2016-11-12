/// <reference types="express-serve-static-core" />

import * as core from "express-serve-static-core";

import ParseService from "./parse";
import RequestService from "./request";
import InjectorService from "./injector";
import RouteService from "./route";

class RouterController {
    constructor(private router: core.Router) {

    }

    public getRouter(): core.Router {
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

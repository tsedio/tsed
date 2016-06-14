import {Endpoint} from "./endpoint";
import * as Express from "express";
import * as Logger from "log-debug";
import HashMap = require("hashmap");

//require("es6-map/implement");

export interface IController {
    targetClass: any;
    instance: any;
    endpoints: HashMap<string, Endpoint>;
    depedencies: string[];
    depend: boolean;
    router: any;
    endpointUrl: string;
    finalEndpointUrl?: string;
    parent?: IController;
}

export interface ICtrlRoute {
    method: string;
    url: string;
}

const controllers = new HashMap<string, IController>();

/**
 * Return the function's name.
 * @param targetClass
 * @returns {any}
 */
function getCtrlName(targetClass: any): string {

    return typeof targetClass === "function"
        ? targetClass.name
        : targetClass.constructor.name;
}

/**
 * Create metadata for a class/controller
 * @param targetClass
 * @returns {Map<string, Endpoint>}
 */
function create(targetClass: any): void {

    let name = getCtrlName(targetClass);

    if (!controllers.has(name)) {
        controllers.set(name, <IController> {
            targetClass:    targetClass,
            endpoints:      new HashMap<string, Endpoint>(),
            depend:         false
        });
    }

}

/**
 * Return this an IController's array.
 * @returns {IController[]}
 */
export function getCtrls(): IController[] {

    let ctrls: IController[] = [];
    controllers
        .forEach(function(ctrl: IController) {
            ctrls.push(ctrl);
        });
    return ctrls;
}

/**
 * Get controller by his name.
 * @param ctrlName
 * @returns {IController}
 */
export function get(ctrlName: string | Function): IController {
    return <IController> controllers.get(typeof ctrlName === "string" ? ctrlName : getCtrlName(ctrlName));
}

/**
 * Has controller in list.
 * @param ctrl
 * @returns {boolean}
 */
export function has(ctrl: string | Function): boolean {
    return controllers.has(typeof ctrl === "string" ? ctrl : getCtrlName(ctrl));
}

/**
 * Instanciate a controller as Router Controller.
 * @param targetClass
 * @returns {IController}
 */
export function instanciate(targetClass: string | Function): IController {

    let name = typeof targetClass === "string" ? targetClass : getCtrlName(targetClass);

    if (!has(name)) {
        throw new Error(`Unable to instanciate controller ${name}.`);
    }

    let controller: IController = get(name);

    // Create parent instance
    if (!controller.instance) {

        let depedencies: IController[] = [];
        // Instanciate depedencies

        /* istanbul ignore else */
        if (controller.depedencies) {
            controller
                .depedencies
                .forEach((ctrlName: string) => {
                    let dep = instanciate(ctrlName);
                    dep.depend = true;
                    dep.parent = controller;

                    depedencies.push(dep);
                });
        }

        controller.instance = ((targetClass) => (
            typeof targetClass === "function"
                ? new targetClass()
                : new targetClass.constructor()
        ))(controller.targetClass);

        let router = Express.Router();

        controller
            .endpoints
            .forEach(function(endpoint: Endpoint){

                let args = endpoint.toArray();

                if (endpoint.hasMethod() && router[endpoint.getMethod()]) {

                    args.shift();

                    if (args.length === 1) {
                        router[endpoint.getMethod()]("/", args[0]);
                    } else {
                        router[endpoint.getMethod()](...args);
                    }

                } else {
                    router.use(...args);
                }

            });

        controller.router = router;

        depedencies
            .forEach(function(ctrl: IController){
                router.use(ctrl.endpointUrl, ctrl.router);
            });

    }

    return controller;
}

/**
 *
 * @param targetClass
 * @param ctrls
 */
export function setDepedencies(targetClass: any, ctrls?: string[]): void {

    create(targetClass);

    get(targetClass).depedencies = ctrls;

}

/**
 *
 * @param targetClass
 * @param endpointUrl
 */
export function setUrl(targetClass: any, endpointUrl: string): void {

    create(targetClass);

    get(targetClass).endpointUrl = endpointUrl;
}

/**
 * Add new endpoint.
 * @param targetClass
 * @param methodClassName
 * @param args
 */
export function setEndpoint(targetClass: Function, methodClassName: string, args: any[]): void {

    create(targetClass);

    let endpoints: HashMap<string, Endpoint> = get(targetClass).endpoints;
    let endpointHandler: Endpoint;

    if (!endpoints.has(methodClassName)) {

        endpointHandler = new Endpoint(targetClass, <string>methodClassName);
        endpoints.set(methodClassName, endpointHandler);

    } else {
        endpointHandler = endpoints.get(methodClassName);
    }

    endpointHandler.push(args);
}

/**
 * Load controllers in Express App
 * @param endpointBase
 * @param app
 */
export function load(app: {use: Function}, endpointBase?: string): void {

    endpointBase = endpointBase || "";

    // Create instance and resolve depedencies

    let ctrls: IController[] = [];

    controllers
        .forEach((ctrl, ctrlName) => {
            ctrls.push(instanciate(ctrlName));
        });

    // Create routing list without routes depedencies
    ctrls
        .filter((ctrl: IController) => {

            if (!ctrl.depend) {

                ctrl.finalEndpointUrl = endpointBase === ctrl.endpointUrl ? ctrl.endpointUrl : endpointBase + ctrl.endpointUrl;

                app.use(ctrl.finalEndpointUrl, ctrl.router);

            }

            return ctrl.depend;

        })

        .forEach((ctrl: IController) => {

            let endpoint: string[] = [];
            let ctrlParent: IController = ctrl;

            // build final endpoint to trace it
            while (ctrlParent) {
                endpoint.unshift(ctrlParent.finalEndpointUrl || ctrlParent.endpointUrl);
                ctrlParent = ctrlParent.parent;
            }

            ctrl.finalEndpointUrl = endpoint.join("");
        });
}

/**
 *
 * @returns {ICtrlRoute[]}
 */
export function getRoutes(): ICtrlRoute[] {

    let routes: ICtrlRoute[] = [];

    getCtrls()
        .sort((ctrlA: any, ctrlB: any) => {

            if (ctrlA.finalEndpointUrl > ctrlB.finalEndpointUrl) {
                return 1;
            }

            if (ctrlA.finalEndpointUrl < ctrlB.finalEndpointUrl) {
                return -1;
            }

            return 0;
        })
        .forEach((ctrl: IController) => {

            ctrl
                .endpoints
                .forEach((endpoint: any) => {

                    if (endpoint.method) {

                        routes.push({
                            method: endpoint.method,
                            url: ctrl.finalEndpointUrl + (endpoint.route || "")
                        });
                    }
                });
        });

    return routes;
}

/**
 * Print routes in console.info
 */
export function printRoutes(): void {

    const space = (x) => {
        let res = "";
        while (x--) res += " ";
        return res;
    };

    getRoutes().forEach((route: ICtrlRoute) => {
        Logger.info("[ERD] " + route.method + space(15 - route.method.length) + route.url);
    });

}
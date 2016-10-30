import {Endpoint} from "./endpoint";
import * as Express from "express";
import {$log} from "ts-log-debug";
import HashMap = require("hashmap");
import * as METADATA_KEYS from "../constants/metadata-keys";
import * as ERRORS_MSGS from "../constants/errors-msgs";
import {IControllerRoute} from '../interfaces/ControllerRoute';
import {getClassName, getContructor} from "../utils/class";

export default class Controller {
    /**
     *
     * @type {Array}
     */
    static controllers: Controller[] = [];
    /**
     *
     */
    protected instance: any;
    /**
     *
     * @type {HashMap<string, Endpoint>}
     */
    protected endpoints: HashMap<string, Endpoint> = new HashMap<string, Endpoint>();
    /**
     *
     */
    protected endpointUrl: string;
    /**
     *
     * @type {Array}
     */
    protected depedencies: any[] = [];
    /**
     *
     */
    public parent: Controller;
    /**
     *
     */
    protected router: any;
    /**
     *
     */
    finalEndpointUrl: string;

    private constructor(
        private targetClass: any
    ) {

    }

    /**
     * Resolve depedencies.
     * @returns {Controller}
     */
    private resolveDepedencies(){

        /* istanbul ignore else */

        this.depedencies = this
            .depedencies
            .map((ctrlOrClass: any) => {

                if(!(ctrlOrClass instanceof Controller)) {

                    const childrenCtrl: Controller = Controller
                        .getController(ctrlOrClass)
                        .instanciate();

                    childrenCtrl.parent = this;

                    return childrenCtrl;
                }

                return ctrlOrClass;
            });


        return this;
    }

    /**
     *
     */
    private createRouter(){
        this.router = Express.Router();

        this.endpoints
            .forEach((endpoint: Endpoint) => {

                let args = endpoint.toArray();

                if (endpoint.hasMethod() && this.router[endpoint.getMethod()]) {

                    args.shift();

                    if (args.length === 1) {
                        this.router[endpoint.getMethod()]("/", args[0]);
                    } else {
                        this.router[endpoint.getMethod()](...args);
                    }

                } else {
                    this.router.use(...args);
                }

            });

        this.depedencies
            .forEach((ctrl: Controller) => {
                this.router.use(ctrl.endpointUrl, ctrl.router);
            });

        return this;
    }

    /**
     *
     * @returns {Controller}
     */
    public instanciate(): any {

        if (!this.instance) {

            this.resolveDepedencies();
            this.instance = typeof this.targetClass === "function"
                    ? new this.targetClass()
                    : new this.targetClass.constructor();

            this.createRouter();
        }

        return this;
    }

    /**
     * Return the class name.
     */
    public getName = () => getClassName(this.targetClass);

    /**
     * Add a new Endpoint if doesn't exists in endpoints registry.
     * @param methodClassName
     * @param args
     * @returns {Controller}
     */
    public setEndpoint(methodClassName: string, args: any[]): Controller {

        let endpointHandler: Endpoint;

        if (!this.endpoints.has(methodClassName)) {

            endpointHandler = new Endpoint(this, methodClassName);
            this.endpoints.set(methodClassName, endpointHandler);

        } else {
            endpointHandler = this.endpoints.get(methodClassName);
        }

        endpointHandler.push(args);
        return this;
    }

    /**
     *
     * @param url
     */
    public setUrl(url: string) {
        this.endpointUrl = url;
    }

    public hasUrl() {
        return !!this.endpointUrl;
    }

    public setDepedencies(depedencies: any[]) {
        this.depedencies = depedencies;
    }

    public getInstance() {
        return this.instance;
    }
    /**
     * Create a new Controller in controllers registry.
     * @param targetClass
     * @param endpointUrl
     * @param depedencies
     */
    static createController(targetClass: any) {

        if(!Controller.hasController(targetClass)){
            const ctrl = new Controller(targetClass);
            Controller.controllers.push(ctrl);

            Reflect.defineMetadata(METADATA_KEYS.CONTROLLER_URL, ctrl, getContructor(targetClass));
        }

    }

    /**
     * Return the controller information associated with the targetClass.
     * @param targetClass
     * @returns {Controller}
     */
    static getController(targetClass: any): Controller {

        if(typeof targetClass === "string") {
            const ctrl = Controller.getControllerByName(targetClass);

            if(ctrl === undefined) {
                throw new Error(ERRORS_MSGS.UNKNOW_CONTROLLER(targetClass));
            }

            return ctrl;
        }

        if (!Controller.hasController(targetClass)) {
            throw new Error(ERRORS_MSGS.UNKNOW_CONTROLLER(getClassName(targetClass)));
        }

        return <Controller> Reflect.getMetadata(METADATA_KEYS.CONTROLLER_URL, getContructor(targetClass));
    }

    /**
     * Find controller by name when depedencies for a controller contain a class name.
     * It's fallback to old resolver depedencies.
     * @param name
     * @returns {any}
     */
    static getControllerByName = (name: string): any =>
        Controller.controllers.find((ctrl: any) => ctrl.getName() === name);

    /**
     *
     * @param targetClass
     */
    static hasController = (targetClass: any) =>
        Reflect.hasMetadata(METADATA_KEYS.CONTROLLER_URL, getContructor(targetClass)) === true;

    /**
     * Add new Endpoint
     * @param targetClass
     * @param methodClassName
     * @param args
     */
    static setEndpoint(targetClass: any, methodClassName: string, args: any[]): void {

        Controller.createController(targetClass);
        Controller.getController(targetClass).setEndpoint(methodClassName, args);

    }

    /**
     *
     * @param targetClass
     * @param url
     */
    static setUrl(targetClass: any, url: string) {

        Controller.createController(targetClass);
        const ctrl = Controller.getController(targetClass);

        ctrl.setUrl(url);

    }

    /**
     *
     * @param targetClass
     * @param depedencies
     */
    static setDepedencies(targetClass: any, depedencies: any[]) {

        Controller.createController(targetClass);
        const ctrl = Controller.getController(targetClass);

        ctrl.setDepedencies(depedencies);

    }

    /**
     *
     * @param app
     * @param endpointBase
     */
    static load(app: {use: Function}, endpointBase?: string): void {

        endpointBase = endpointBase || "";

        // Create instance and resolve depedencies
        Controller
            .controllers
            //.map(targetClass => Controller.getController(targetClass))
            .filter((ctrl: Controller) => {

                ctrl.instanciate();

                if (!ctrl.parent){
                    ctrl.finalEndpointUrl = endpointBase === ctrl.endpointUrl ? ctrl.endpointUrl : endpointBase + ctrl.endpointUrl;
                    app.use(ctrl.finalEndpointUrl, ctrl.router);
                }

                return !ctrl.parent;
            })
            .forEach((ctrl: Controller)  => { // Ctrl racine

                let ctrlParent = ctrl;
                let endpoint: string[] = [];

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
    static getRoutes(): IControllerRoute[] {

        const routes: IControllerRoute[] = [];

        const mapRoutes = (ctrl) => {
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
        };

        Controller
            .controllers
            //.map(targetClass => Controller.getController(targetClass))
            .sort((ctrlA: any, ctrlB: any) => {

                if (ctrlA.finalEndpointUrl > ctrlB.finalEndpointUrl) {
                    return 1;
                }

                if (ctrlA.finalEndpointUrl < ctrlB.finalEndpointUrl) {
                    return -1;
                }

                return 0;
            })
            .forEach((ctrl: Controller) => mapRoutes(ctrl));

        return routes;
    }

    /**
     *
     */
    static printRoutes(): void {

        const space = (x) => {
            let res = "";
            while (x--) res += " ";
            return res;
        };

        Controller
            .getRoutes()
            .forEach((route: IControllerRoute) => {
                $log.info("[ERD] " + route.method + space(15 - route.method.length) + route.url);
            });

    }

}


//const controllers = new HashMap<string, IController>();

/**
 * Return the function's name.
 * @param targetClass
 * @returns {any}
 */
/*function getCtrlName(targetClass: any): string {

    return typeof targetClass === "function"
        ? targetClass.name
        : targetClass.constructor.name;
}*/

/**
 * Create metadata for a class/controller
 * @param targetClass
 * @returns {Map<string, Endpoint>}
 */
/*
function create(targetClass: any): void {

    if (Reflect.hasOwnMetadata(METADATA_KEYS.CONTROLLER, targetClass) === true) {
        throw new Error(ERRORS_MSGS.DUPLICATED_CONTROLLER_DECORATOR);
    }

    Reflect.defineMetadata(METADATA_KEYS.CONTROLLER, {
        //targetClass:    targetClass,
        endpoints:      new HashMap<string, Endpoint>(),
        depend:         false
    }, targetClass);




    /!*let name = getCtrlName(targetClass);

    if (!controllers.has(name)) {
        controllers.set(name, <IController> );
    }*!/
}
*/

/**
 * Return this an IController's array.
 * @returns {IController[]}
 */
/*export function getCtrls(): IController[] {

    let ctrls: IController[] = [];
    controllers
        .forEach(function(ctrl: IController) {
            ctrls.push(ctrl);
        });
    return ctrls;
}*/

/**
 * Get controller by his name.
 * @param ctrlName
 * @returns {IController}
 */
/*export function get(ctrlName: string | Function): IController {
    return <IController> controllers.get(typeof ctrlName === "string" ? ctrlName : getCtrlName(ctrlName));
}*/

/**
 * Has controller in list.
 * @param ctrl
 * @returns {boolean}
 */
/*export function has(ctrl: string | Function): boolean {
    return controllers.has(typeof ctrl === "string" ? ctrl : getCtrlName(ctrl));
}*/

/**
 * Instanciate a controller as Router Controller.
 * @param targetClass
 * @returns {IController}
 */
// export function instanciate(targetClass: string | Function): IController {
//
//     let name = typeof targetClass === "string" ? targetClass : getCtrlName(targetClass);
//
//     if (!has(name)) {
//         throw new Error(ERRORS_MSGS.UNABLE_TO_INSTANCIATE_CTRL);
//     }
//
//     let controller: IController = get(name);
//
//     // Create parent instance
//     if (!controller.instance) {
//
//         let depedencies: IController[] = [];
//         // Instanciate depedencies
//
//         /* istanbul ignore else */
//         if (controller.depedencies) {
//             controller
//                 .depedencies
//                 .forEach((ctrlName: string) => {
//                     let dep = instanciate(ctrlName);
//                     dep.depend = true;
//                     dep.parent = controller;
//
//                     depedencies.push(dep);
//                 });
//         }
//
//         controller.instance = ((targetClass) => (
//             typeof targetClass === "function"
//                 ? new targetClass()
//                 : new targetClass.constructor()
//         ))(controller.targetClass);
//
//         let router = Express.Router();
//
//         controller
//             .endpoints
//             .forEach((endpoint: Endpoint) => {
//
//                 let args = endpoint.toArray();
//
//                 if (endpoint.hasMethod() && router[endpoint.getMethod()]) {
//
//                     args.shift();
//
//                     if (args.length === 1) {
//                         router[endpoint.getMethod()]("/", args[0]);
//                     } else {
//                         router[endpoint.getMethod()](...args);
//                     }
//
//                 } else {
//                     router.use(...args);
//                 }
//
//             });
//
//         controller.router = router;
//
//         depedencies
//             .forEach((ctrl: IController) => {
//                 router.use(ctrl.endpointUrl, ctrl.router);
//             });
//
//     }
//
//     return controller;
// }

/**
 *
 * @param targetClass
 * @param ctrls
 */
// export function setDepedencies(targetClass: any, ctrls?: string[]): void {
//
//     create(targetClass);
//
//     get(targetClass).depedencies = ctrls;
//
// }

/**
 *
 * @param targetClass
 * @param endpointUrl
 */
// export function setUrl(targetClass: any, endpointUrl: string): void {
//
//     create(targetClass);
//
//     get(targetClass).endpointUrl = endpointUrl;
// }

/**
 * Add new endpoint.
 * @param targetClass
 * @param methodClassName
 * @param args
 */
// export function setEndpoint(targetClass: Function, methodClassName: string, args: any[]): void {
//
//     create(targetClass);
//
//     let endpoints: HashMap<string, Endpoint> = get(targetClass).endpoints;
//     let endpointHandler: Endpoint;
//
//     if (!endpoints.has(methodClassName)) {
//
//         endpointHandler = new Endpoint(targetClass, <string>methodClassName);
//         endpoints.set(methodClassName, endpointHandler);
//
//     } else {
//         endpointHandler = endpoints.get(methodClassName);
//     }
//
//     endpointHandler.push(args);
// }

/**
 * Load controllers in Express App
 * @param endpointBase
 * @param app
 */
// export function load(app: {use: Function}, endpointBase?: string): void {
//
//     endpointBase = endpointBase || "";
//
//     // Create instance and resolve depedencies
//
//     let ctrls: IController[] = [];
//
//     controllers
//         .forEach((ctrl, ctrlName) => {
//             ctrls.push(instanciate(ctrlName));
//         });
//
//     // Create routing list without routes depedencies
//     ctrls
//         .filter((ctrl: IController) => {
//
//             if (!ctrl.depend) {
//
//                 ctrl.finalEndpointUrl = endpointBase === ctrl.endpointUrl ? ctrl.endpointUrl : endpointBase + ctrl.endpointUrl;
//
//                 app.use(ctrl.finalEndpointUrl, ctrl.router);
//
//             }
//
//             return ctrl.depend;
//
//         })
//
//         .forEach((ctrl: IController) => {
//
//             let endpoint: string[] = [];
//             let ctrlParent: IController = ctrl;
//
//             // build final endpoint to trace it
//             while (ctrlParent) {
//                 endpoint.unshift(ctrlParent.finalEndpointUrl || ctrlParent.endpointUrl);
//                 ctrlParent = ctrlParent.parent;
//             }
//
//             ctrl.finalEndpointUrl = endpoint.join("");
//         });
// }

/**
 *
 * @returns {ICtrlRoute[]}
 */
// export function getRoutes(): ICtrlRoute[] {
//
//     let routes: ICtrlRoute[] = [];
//
//     getCtrls()
//         .sort((ctrlA: any, ctrlB: any) => {
//
//             if (ctrlA.finalEndpointUrl > ctrlB.finalEndpointUrl) {
//                 return 1;
//             }
//
//             if (ctrlA.finalEndpointUrl < ctrlB.finalEndpointUrl) {
//                 return -1;
//             }
//
//             return 0;
//         })
//         .forEach((ctrl: IController) => {
//
//             ctrl
//                 .endpoints
//                 .forEach((endpoint: any) => {
//
//                     if (endpoint.method) {
//
//                         routes.push({
//                             method: endpoint.method,
//                             url: ctrl.finalEndpointUrl + (endpoint.route || "")
//                         });
//                     }
//                 });
//         });
//
//     return routes;
// }


import {Endpoint} from "./endpoint";
import * as Express from "express";
import {$log} from "ts-log-debug";
import HashMap = require("hashmap");
import * as ERRORS_MSGS from "../constants/errors-msgs";
import {IControllerRoute} from '../interfaces/ControllerRoute';
import {getClassName} from "../utils/class";
import Metadata from '../metadata/metadata';
import {
    CONTROLLER_URL,
    CONTROLLER_DEPEDENCIES,
    ENDPOINT_ARGS
} from '../constants/metadata-keys';


export default class Controller {
    /**
     *
     * @type {Array}
     */
    static controllers: Controller[] = [];
    static rootControllers: Controller[];
    /**
     *
     */
    // protected instance: any;
    /**
     *
     * @type {HashMap<string, Endpoint>}
     */
    protected endpoints: Endpoint[] = [];
    /**
     *
     */
    protected parent: Controller;
    /**
     *
     */
    protected router: any;
    /**
     *
     */
    protected finalEndpointUrl: string;

    /**
     *
     * @param targetClass
     * @param endpointUrl
     * @param depedencies
     */
    private constructor(
        private targetClass: any,
        private endpointUrl: string,
        private depedencies: (string | Function | Controller)[] = []
    ) {

        this.router = Express.Router();
        this.createEndpoint();
    }

    /**
     *
     * @param app
     * @param endpointBase
     */
    static load(app: {use: Function}, endpointBase?: string): void {

        endpointBase = endpointBase || "";

        // GET All ctrls referenced by CONTROLLER_URL
        const controllers = Metadata.getTargetsFromPropertyKey(CONTROLLER_URL);

        Controller.rootControllers = controllers
            .map((target: any) => {

                const ctrl = new Controller(
                    target,
                    Metadata.get(CONTROLLER_URL, target),
                    Metadata.get(CONTROLLER_DEPEDENCIES, target)
                );

                Controller.controllers.push(ctrl);

                return ctrl;
            })

            .map(ctrl => ctrl.resolveDepedencies())

            .filter(ctrl => {

                ctrl.createRoutes();

                if (!ctrl.parent){
                    ctrl.finalEndpointUrl = endpointBase === ctrl.endpointUrl ? ctrl.endpointUrl : endpointBase + ctrl.endpointUrl;
                    app.use(ctrl.finalEndpointUrl, ctrl.router);
                }

                return !ctrl.parent;
            })

            .map((ctrl: Controller)  => { // Ctrl racine

                let ctrlParent = ctrl;
                let endpointUrl: string[] = [];

                // build final endpoint to trace it
                while (ctrlParent) {
                    endpointUrl.unshift(ctrlParent.finalEndpointUrl || ctrlParent.endpointUrl);
                    ctrlParent = ctrlParent.parent;
                }

                ctrl.finalEndpointUrl = endpointUrl.join("");

                return ctrl;
            });
    }

    /**
     *
     */
    private resolveDepedencies(){

        this.depedencies = this
            .depedencies
            .map((dep: string | Function) => {

                const ctrl = Controller.getController(<string | Function>dep);

                if(ctrl === undefined){
                    throw new Error(ERRORS_MSGS.UNKNOW_CONTROLLER(
                        typeof dep === "string" ? dep : getClassName(dep)
                    ));
                }

                ctrl.parent = this;

                // PREVENT CYCLIC REFERENCES
                if (ctrl.parent === this && this.parent === ctrl) {
                    throw new Error(ERRORS_MSGS.CYCLIC_REF(
                        ctrl.getName(),
                        this.getName()
                    ));
                }

                return ctrl;
            });

        return this;
    }

    /**
     * Create all endpoint for a targetClass.
     */
    private createEndpoint(){

        this.endpoints = <Endpoint[]> Object
            .keys(this.targetClass.prototype)
            .map<Endpoint | boolean>((targetKey: string) => {

                if(!Metadata.has(ENDPOINT_ARGS, this.targetClass, targetKey)) {
                    return false;
                }

                const args = Metadata.get(ENDPOINT_ARGS, this.targetClass, targetKey);
                const endpoint: Endpoint = new Endpoint(this, targetKey);
                endpoint.push(args);

                return endpoint;
            })
            .filter(e => !!e);

        return this;
    }

    /**
     * Create all routes.
     */
    private createRoutes(){
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
    }

    /**
     * Return the class name.
     */
    public getName = () => getClassName(this.targetClass);



    /**
     *
     */
    public getEndpointUrl = (): string => this.endpointUrl;

    /**
     *
     */
    public getAbsoluteUrl = (): string => this.finalEndpointUrl;

    public hasEndpointUrl() {
        return !!this.endpointUrl;
    }

    /**
     *
     */
    public getInstance(): any {
        // TODO ADD INJECT DEPEDENCIES
        // TODO Test if SINGLETON ANNOTATION is used to instanciate controller class.
        return new this.targetClass();
    }

    /**
     *
     * @param target
     * @returns {any}
     */
    static getController(target: string | Function){

        let ctrl;

        if (typeof target === 'string') {
            ctrl = this.controllers.find(ctrl => ctrl.getName() === target);
        } else {
            ctrl = this.controllers.find(ctrl => ctrl.targetClass === target)
        }

        return ctrl;
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
     * Print all route mounted in express via Annotation.
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
    /**
     *
     * @returns {Controller}
     */
    /*public instanciate(): any {

     if (!this.instance) {

     this.resolveDepedencies();
     this.instance = typeof this.targetClass === "function"
     ? new this.targetClass()
     : new this.targetClass.constructor();

     this.createRouter();
     }

     return this;
     }*/


    /**
     * Add a new Endpoint if doesn't exists in endpoints registry.
     * @param methodClassName
     * @param args
     * @returns {Controller}
     */
    /*public setEndpoint(methodClassName: string, args: any[]): Controller {

     let endpointHandler: Endpoint;

     if (!this.endpoints.has(methodClassName)) {

     endpointHandler = new Endpoint(this, methodClassName);
     this.endpoints.set(methodClassName, endpointHandler);

     } else {
     endpointHandler = this.endpoints.get(methodClassName);
     }

     endpointHandler.push(args);
     return this;
     }*/

    /**
     *
     * @param url
     */
    /*public setUrl(url: string) {
     this.endpointUrl = url;
     return this;
     }*/

    /**
     *
     * @param depedencies
     * @returns {Controller}
     */
    /*public setDepedencies(depedencies: any[]) {
     this.depedencies = depedencies;



     return this;
     }*/


    /**
     * Create a new Controller in controllers registry.
     * @param targetClass
     * @param endpointUrl
     * @param depedencies
     */
    /*static createController(targetClass: any) {

     if(!Controller.hasController(targetClass)){
     const ctrl = new Controller(targetClass);
     Controller.controllers.push(ctrl);

     Reflect.defineMetadata(METADATA_KEYS.CONTROLLER_URL, ctrl, getContructor(targetClass));
     }

     }
     */
    /**
     * Return the controller information associated with the targetClass.
     * @param targetClass
     * @returns {Controller}
     */
    /*static getController(targetClass: any): Controller {

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
     */
    /**
     * Find controller by name when depedencies for a controller contain a class name.
     * It's fallback to old resolver depedencies.
     * @param name
     * @returns {any}
     */
    /*static getControllerByName = (name: string): any =>
     Controller.controllers.find((ctrl: any) => ctrl.getName() === name);*/

    /**
     *
     * @param targetClass
     */
    /*static hasController = (targetClass: any) =>
     Reflect.hasMetadata(METADATA_KEYS.CONTROLLER_URL, getContructor(targetClass)) === true;*/

    /**
     * Add new Endpoint
     * @param targetClass
     * @param methodClassName
     * @param args
     */
    /*static setEndpoint(targetClass: any, methodClassName: string, args: any[]): void {

     Controller.createController(targetClass);
     Controller.getController(targetClass).setEndpoint(methodClassName, args);

     }*/

    /**
     *
     * @param targetClass
     * @param url
     */
    /*static setUrl(targetClass: any, url: string) {

     Controller.createController(targetClass);
     const ctrl = Controller.getController(targetClass);

     ctrl.setUrl(url);

     }*/

    /**
     *
     * @param targetClass
     * @param depedencies
     */
    /*static setDepedencies(targetClass: any, depedencies: any[]) {

     Controller.createController(targetClass);
     const ctrl = Controller.getController(targetClass);

     ctrl.setDepedencies(depedencies);

     }*/

}
import {Endpoint} from "./endpoint";
import * as Express from "express";
import {$log} from "ts-log-debug";
import * as ERRORS_MSGS from "../constants/errors-msgs";
import {IControllerRoute} from "../interfaces/ControllerRoute";
import {getClassName} from "../utils/class";
import Metadata from "../metadata/metadata";

import {
    CONTROLLER_URL,
    CONTROLLER_DEPEDENCIES,
    ENDPOINT_ARGS
} from "../constants/metadata-keys";

import {InjectorService, RouterController} from "../services";

export default class Controller {
    /**
     *
     * @type {Array}
     */
    static controllers: Controller[] = [];
    /**
     *
     * @type {Array}
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
    protected absoluteUrl: string;

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
        this.metadataToEndpoints();
    }

    /**
     *
     */
    private resolveDepedencies() {

        this.depedencies = this
            .depedencies
            .map((dep: string | Function) => {

                const ctrl = Controller.getController(<string | Function>dep);

                if (ctrl === undefined) {
                    throw new Error(ERRORS_MSGS.UNKNOW_CONTROLLER(
                        typeof dep === "string" ? dep : getClassName(dep)
                    ));
                }

                ctrl.parent = this;

                // PREVENT CYCLIC REFERENCES
                /* istanbul ignore next */
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
    private metadataToEndpoints(): Controller {

        this.endpoints = <Endpoint[]> Object
            .getOwnPropertyNames(this.targetClass.prototype)
            .map<Endpoint | boolean>((targetKey: string) => {

                if (!Metadata.has(ENDPOINT_ARGS, this.targetClass, targetKey)) {
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
     * Map all endpoints generated to his class Router.
     */
    private mapEndpointsToRouters(): Controller {

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
     * Return the class name.
     */
    public getName = () => getClassName(this.targetClass);

    /**
     *
     */
    public getEndpointUrl = (base: string = ""): string =>
        base === this.endpointUrl ? this.endpointUrl : base + this.endpointUrl;

    /**
     *
     */
    public getAbsoluteUrl = (): string => this.absoluteUrl;

    public hasEndpointUrl() {
        return !!this.endpointUrl;
    }

    /**
     *
     */
    public getInstance(): any {
        // TODO ADD INJECT DEPEDENCIES
        // TODO Test if SINGLETON ANNOTATION is used to instanciate controller class.

        const locals = new WeakMap<string|Function, any>();

        locals.set(RouterController, new RouterController(this.router));

        return InjectorService.invoke(this.targetClass, locals);

       // return new this.targetClass();
    }

    /**
     *
     * @param app
     * @param endpointBase
     */
    static load(app: {use: Function}, endpointBase: string = "") {

        this.controllersFromMetadatas()
            .resolveControllersUrls(endpointBase)
            .mapRoutersToApp(app);

        return this;
    }

    /**
     *
     */
    private static controllersFromMetadatas() {
        const controllers = Metadata.getTargetsFromPropertyKey(CONTROLLER_URL);

        Controller.controllers = controllers
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
            .map(ctrl => ctrl.mapEndpointsToRouters());

        return this;
    }

    /**
     * Bind all root router Controller to express Application instance.
     */
    private static mapRoutersToApp(app: {use: Function}) {

        this.controllers
            .forEach((ctrl) => {
                if (!ctrl.parent) {
                    app.use(ctrl.getAbsoluteUrl(), ctrl.router);
                }
            });

        return this;
    }

    /**
     * Resolve all absolute url for each controllers created.
     */
    private static resolveControllersUrls(endpointBase: string = "") {

        this.controllers
            .filter(ctrl => {
                if (!ctrl.parent) {
                    ctrl.absoluteUrl = ctrl.getEndpointUrl(endpointBase);
                }
                return !!ctrl.parent;
            })
            .forEach((ctrl: Controller)  => { // children controller

                if (ctrl.parent) {
                    let ctrlParent = ctrl;
                    let endpointUrls: string[] = [];

                    // build final endpoint to trace it
                    while (ctrlParent) {
                        endpointUrls.unshift(ctrlParent.absoluteUrl || ctrlParent.endpointUrl);
                        ctrlParent = ctrlParent.parent;
                    }

                    ctrl.absoluteUrl = endpointUrls.join("");

                    return ctrl;
                }

            });

        return this;

    }

    /**
     * Return a controller from his string name or his class declaration.
     * @param target
     * @returns {any}
     */
    static getController(target: string | Function): Controller {

        let ctrl: Controller;

        if (typeof target === "string") {
            ctrl = this.controllers.find(ctrl => ctrl.getName() === target);
        } else {
            ctrl = this.controllers.find(ctrl => ctrl.targetClass === target);
        }

        return ctrl;
    }

    /**
     * Return all routes generated from controllers and these endpoints.
     * @returns {ICtrlRoute[]}
     */
    static getRoutes(): IControllerRoute[] {

        const routes: IControllerRoute[] = [];

        const mapRoutes = (ctrl) => {
            ctrl
                .endpoints
                .forEach((endpoint: any) => {

                    if (endpoint.hasMethod()) {

                        routes.push({
                            method: endpoint.getMethod(),
                            url: ctrl.getAbsoluteUrl() + (endpoint.getRoute() || "")
                        });

                    }
                });
        };

        Controller
            .controllers
            .sort((ctrlA: any, ctrlB: any) => {

                /* istanbul ignore next */
                if (ctrlA.absoluteUrl > ctrlB.absoluteUrl) {
                    return 1;
                }

                /* istanbul ignore next */
                if (ctrlA.absoluteUrl < ctrlB.absoluteUrl) {
                    return -1;
                }
                /* istanbul ignore next */
                return 0;
            })
            .forEach((ctrl: Controller) => mapRoutes(ctrl));

        return routes;
    }

    /**
     * Print all route mounted in express via Annotation.
     */
    static printRoutes(logger: {info: (s) => void} = $log): void {

        const space = (x) => {
            let res = "";
            while (x--) res += " ";
            return res;
        };

        Controller
            .getRoutes()
            .forEach((route: IControllerRoute) => {
                logger.info("[TSED] " + route.method + space(15 - route.method.length) + route.url);
            });

    }

}
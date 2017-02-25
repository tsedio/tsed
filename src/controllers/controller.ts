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
    ENDPOINT_ARGS, CONTROLLER_MOUNT_ENDPOINTS
} from "../constants/metadata-keys";

import {InjectorService, RouterController} from "../services";

const colors = require("colors");

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
     * @param targetClass
     * @param endpointUrl
     * @param dependencies
     */
    private constructor(
        private _targetClass: any,
        private endpointUrl: string,
        private dependencies: (string | Function | Controller)[] = []
    ) {

        this.router = Express.Router();
        this.metadataToEndpoints();
    }

    /**
     *
     */
    private resolveDepedencies() {

        this.dependencies = this
            .dependencies
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
            .getOwnPropertyNames(this._targetClass.prototype)
            .map<Endpoint | boolean>((targetKey: string) => {

                if (!Metadata.has(ENDPOINT_ARGS, this._targetClass, targetKey)) {
                    return false;
                }

                const args = Metadata.get(ENDPOINT_ARGS, this._targetClass, targetKey);
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

        this.dependencies
            .forEach((ctrl: Controller) => {
                this.router.use(ctrl.endpointUrl, ctrl.router);
            });

        return this;
    }

    /**
     * Return the class name.
     */
    public getName = () => getClassName(this._targetClass);

    /**
     * Resolve final endpoint url.
     */
    public getEndpointUrl = (endpoint: string = ""): string =>
        endpoint === this.endpointUrl ? this.endpointUrl : endpoint + this.endpointUrl;

    /**
     *
     */
    // public getAbsoluteUrl = (): string => this.absoluteUrl;

    public hasEndpointUrl() {
        return !!this.endpointUrl;
    }

    /**
     *
     */
    public getInstance(): any {
        // TODO ADD INJECT DEPEDENCIES
        // TODO Test if SINGLETON ANNOTATION is used to instanciate controller class.

        const locals = new Map<string|Function, any>();

        locals.set(RouterController, new RouterController(this.router));

        return InjectorService.invoke(this._targetClass, locals);

        // return new this.targetClass();
    }

    /**
     *
     * @param app
     * @param endpointsRules
     */
    static load(app: {use: Function}) {

        this.controllersFromMetadatas()
            .mountControllers(app);

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
    private static mountControllers(app: {use: Function}) {

        this.controllers
            .filter(ctrl => !ctrl.parent)
            .forEach(finalCtrl => {

                finalCtrl
                    .getMountEndpoints()
                    .forEach(endpoint => {

                        app.use(finalCtrl.getEndpointUrl(endpoint), finalCtrl.router);

                    });


            });


        return this;
    }

    /**
     *
     */
    private getMountEndpoints = () => Metadata.get(CONTROLLER_MOUNT_ENDPOINTS, this._targetClass) || [];

    /**
     *
     * @returns {any}
     */
    get targetClass(): any {
        return this._targetClass;
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
            ctrl = this.controllers.find(ctrl => ctrl._targetClass === target);
        }

        return ctrl;
    }

    /**
     * Return all routes generated from controllers and these endpoints.
     * @returns {ICtrlRoute[]}
     */
    static getRoutes(): IControllerRoute[] {

        let routes: IControllerRoute[] = [];

        const buildRoutes = (ctrl: Controller, endpointUrl: string) => {

            ctrl.dependencies.forEach((ctrl: Controller) => buildRoutes(ctrl, `${endpointUrl}${ctrl.endpointUrl}`));

            ctrl.endpoints.forEach((endpoint: Endpoint) => {

                if (endpoint.hasMethod()) {

                    routes.push({
                        method: endpoint.getMethod(),
                        name: `${getClassName(ctrl.targetClass)}.${endpoint.getMethodClassName()}()`,
                        url: `${endpointUrl}${endpoint.getRoute() || ""}`
                    });

                }
            });

        };

        Controller.controllers
            .filter(ctrl => !ctrl.parent)
            .forEach((finalCtrl: Controller) => {

                finalCtrl
                    .getMountEndpoints()
                    .map(endpoint => finalCtrl.getEndpointUrl(endpoint))
                    .forEach(endpoint => buildRoutes(finalCtrl, endpoint));

            });


        routes = routes.sort((routeA: IControllerRoute, routeB: IControllerRoute) => {

            /* istanbul ignore next */
            if (routeA.url > routeB.url) {
                return 1;
            }

            /* istanbul ignore next */
            if (routeA.url < routeB.url) {
                return -1;
            }
            /* istanbul ignore next */
            return 0;
        });

        return routes;
    }

    /**
     * Print all route mounted in express via Annotation.
     */
    static printRoutes(logger: {info: (s) => void} = $log): void {

        const mapColor = {
            GET: (<any>"GET").green,
            POST: (<any>"POST").yellow,
            PUT: (<any>"PUT").blue,
            DELETE: (<any>"DELETE").red,
            PATCH: (<any>"PATCH").magenta,
            ALL: (<any>"ALL").cyan
        };

        const routes = Controller.getRoutes()
            .map(route => {

                const method = route.method.toUpperCase();

                route.method = <any>{length: method.length, toString: () => mapColor[method] || method};

                return route;
            });

        let str = $log.drawTable(routes, {
            padding: 1,
            header: {
                method: "Method",
                url: "Endpoint",
                name: "Class method"
            }
        });

        logger.info("\n" + str.trim());

    }

}
import {Endpoint} from "./endpoint";
import * as Express from "express";
import {getClassName} from "../utils/class";
import Metadata from "../metadata/metadata";

import {
    ENDPOINT_ARGS, CONTROLLER_MOUNT_ENDPOINTS
} from "../constants/metadata-keys";

export default class Controller {

    /**
     * Endpoints controller.
     * @type {Array}
     */
    private _endpoints: Endpoint[] = [];

    /**
     *
     */
    private _parent: Controller;

    /**
     * The express router instance for the controller.
     */
    private _router: Express.Router = Express.Router();

    /**
     * Build a new Controller metadata.
     * @param _targetClass
     * @param _endpointUrl
     * @param _dependencies
     */
    constructor (
        private _targetClass: any,
        private _endpointUrl: string,
        private _dependencies: (string | Function | Controller)[] = []
    ) {
        this.metadataToEndpoints();
    }

    /**
     * Create all endpoint for a targetClass.
     */
    private metadataToEndpoints(): Controller {

        this._endpoints = <Endpoint[]> Object
            .getOwnPropertyNames(this._targetClass.prototype)
            .map<Endpoint | boolean>((targetKey: string) => {

                if (!Metadata.has(ENDPOINT_ARGS, this._targetClass, targetKey)) {
                    return false;
                }

                const args = Metadata.get(ENDPOINT_ARGS, this._targetClass, targetKey);
                const endpoint: Endpoint = new Endpoint(this._targetClass, targetKey);
                endpoint.push(args);

                return endpoint;
            })
            .filter(e => !!e);

        return this;
    }

    /**
     * Map all endpoints generated to his class Router.
     */
    public mapEndpointsToRouters(): Controller {

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
    public hasEndpointUrl() {
        return !!this.endpointUrl;
    }

    /**
     *
     */
    public getMountEndpoints = () => Metadata.get(CONTROLLER_MOUNT_ENDPOINTS, this._targetClass) || [];

    /**
     *
     * @returns {any}
     */
    get targetClass(): any {
        return this._targetClass;
    }

    /**
     *
     * @returns {Endpoint[]}
     */
    get endpoints(): Endpoint[] {
        return this._endpoints;
    }

    /**
     *
     * @returns {Controller}
     */
    get parent(): Controller {
        return this._parent;
    }

    /**
     *
     * @param parent
     */
    set parent(parent: Controller) {
        this._parent = parent;
    }

    /**
     *
     * @returns {(string|Function|Controller)[]}
     */
    get dependencies(): (string | Function | Controller)[] {
        return this._dependencies;
    }

    /**
     *
     * @param dependencies
     */
    set dependencies(dependencies: (string | Function | Controller)[]) {
        this._dependencies = dependencies;
    }

    /**
     *
     * @returns {string}
     */
    get endpointUrl(): string {
        return this._endpointUrl;
    }

    /**
     *
     * @returns {Express.Router}
     */
    get router(): Express.Router {
        return this._router;
    }
}
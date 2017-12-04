import * as Express from "express";
import {IRouterOptions} from "../../config/interfaces/IRouterOptions";
import {NotEnumerable} from "../../core/decorators";
import {Type} from "../../core/interfaces";
import {getClass} from "../../core/utils";
import {ProviderStorable} from "../../di/class/ProviderStorable";

import {IControllerMiddlewares, IControllerOptions} from "../interfaces";
import {IChildrenController} from "../interfaces/IChildrenController";
import {EndpointRegistry} from "../registries/EndpointRegistry";
import {EndpointMetadata} from "./EndpointMetadata";

export class ControllerProvider extends ProviderStorable<any> implements IControllerOptions {
    /**
     * The path for the controller
     */
    @NotEnumerable()
    private _path: string;
    /**
     *
     */
    @NotEnumerable()
    private _routerOptions: IRouterOptions;
    /**
     * The path for the RouterController when the controller will be mounted to the Express Application.
     */
    @NotEnumerable()
    private _routerPaths: string[] = [];
    /**
     * Controllers that depend to this controller.
     * @type {Array}
     * @private
     */
    @NotEnumerable()
    private _dependencies: IChildrenController[] = [];

    @NotEnumerable()
    public router: Express.Router;

    @NotEnumerable()
    private _middlewares: IControllerMiddlewares = {
        useBefore: [],
        use: [],
        useAfter: []
    };

    constructor(provide: any) {
        super(provide);
        this.type = "controller";
    }

    /**
     *
     * @returns {string}
     */
    get path(): string {
        return this._path;
    }

    /**
     * set path
     * @param value
     */
    set path(value: string) {
        this._path = value;
    }


    get routerPaths(): string[] {
        return this._routerPaths;
    }

    /**
     *
     * @returns {Endpoint[]}
     */
    get endpoints(): EndpointMetadata[] {
        return EndpointRegistry.getEndpoints(getClass(this.provide));
    }

    /**
     *
     * @returns {Type<any>[]}
     */
    get dependencies(): IChildrenController[] {
        return this._dependencies;
    }

    /**
     *
     * @param dependencies
     */
    set dependencies(dependencies: IChildrenController[]) {
        this._dependencies = dependencies;
        this._dependencies.forEach(d => d.$parentCtrl = this);
    }

    /**
     *
     * @returns {IRouterOptions}
     */
    get routerOptions(): IRouterOptions {
        return this._routerOptions;
    }

    /**
     *
     * @returns {ControllerProvider}
     */
    get parent() {
        return this.provide.$parentCtrl;
    }

    /**
     *
     * @param value
     */
    set routerOptions(value: IRouterOptions) {
        this._routerOptions = value;
    }

    /**
     *
     * @returns {any[]}
     */
    get middlewares(): IControllerMiddlewares {
        return this._middlewares;
    }

    /**
     *
     * @param middlewares
     */
    set middlewares(middlewares: IControllerMiddlewares) {

        const concat = (key: string, a: any, b: any) => a[key] = a[key].concat(b[key]);

        Object.keys(middlewares).forEach((key: string) => {
            concat(key, this._middlewares, middlewares);
        });
    }

    /**
     *
     * @param {string} path
     */
    public pushRouterPath(path: string) {
        this._routerPaths.push(path);
    }

    /**
     * Resolve final endpoint url.
     */
    public getEndpointUrl = (routerPath: string): string =>
        (routerPath === this.path ? this.path : (routerPath || "") + this.path).replace(/\/\//gi, "/");

    /**
     *
     */
    public hasEndpointUrl() {
        return !!this.path;
    }

    /**
     *
     * @returns {boolean}
     */
    public hasDependencies(): boolean {
        return !!this.dependencies.length;
    }

    /**
     *
     * @returns {boolean}
     */
    public hasParent(): boolean {
        return !!this.provide.$parentCtrl;
    }
}
/**
 * @module mvc
 */
/** */
import * as Express from "express";

import {IControllerOptions, IRouterOptions} from "../interfaces/ControllerOptions";
import {Provider} from "../../di/class/Provider";
import {EndpointRegistry} from "../registries/EndpointRegistry";
import {EndpointMetadata} from "./EndpointMetadata";
import {getClass} from "../../core/utils/index";
import {Type} from "../../core/interfaces/Type";
import {NotEnumerable} from "../../core/decorators/enumerable";


export interface ChildrenController extends Type<any> {
    $parentCtrl?: ControllerProvider;
}

/**
 *
 */
export class ControllerProvider extends Provider<any> implements IControllerOptions {
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
    private _dependencies: ChildrenController[] = [];

    /**
     *
     */
    @NotEnumerable()
    private _scope: boolean | "request";

    @NotEnumerable()
    public router: Express.Router;

    constructor(provide) {
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
        return EndpointRegistry.getByTarget(getClass(this.provide));
    }

    /**
     *
     * @returns {Type<any>[]}
     */
    get dependencies(): ChildrenController[] {
        return this._dependencies;
    }

    /**
     *
     * @param dependencies
     */
    set dependencies(dependencies: ChildrenController[]) {
        this._dependencies = dependencies;
        this._dependencies.forEach(d => d.$parentCtrl = this);
    }

    /**
     * Create a new controler for each per incoming request.
     * @returns {boolean}
     */
    get scope(): boolean | "request" {
        return this._scope;
    }

    /**
     *
     * @param scope
     */
    set scope(scope: boolean | "request") {
        this._scope = scope;
    }

    /**
     *
     * @returns {IRouterOptions}
     */
    get routerOptions(): IRouterOptions {
        return this._routerOptions;
    }

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
     * @returns {Express.Router}
     */
    /*get router(): Express.Router {
     return this._router;
     }*/

    pushRouterPath(path: string) {
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
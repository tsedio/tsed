/**
 * @module common/mvc
 */
/** */

import {Metadata} from "../../core/class/Metadata";
import {Storable} from "../../core/class/Storable";
import {Store} from "../../core/class/Store";
import {Deprecated, NotEnumerable} from "../../core/decorators";
import {Type} from "../../core/interfaces";
import {isArrayOrArrayClass, isPromise} from "../../core/utils";
import {ENDPOINT_METHODS} from "../constants";
import {PathParamsType} from "../interfaces/PathParamsType";

/**
 * EndpointMetadata contains metadata about a controller and his method.
 * Each annotation (@Get, @Body...) attached to a method are stored in a endpoint.
 * EndpointMetadata convert this metadata to an array which contain arguments to call an Express method.
 *
 * Example :
 *
 *    @Controller("/my-path")
 *    provide MyClass {
 *
 *        @Get("/")
 *        @Authenticated()
 *        public myMethod(){}
 *    }
 *
 */
export class EndpointMetadata extends Storable {
    /**
     *
     * @type {Array}
     */
    @NotEnumerable()
    private _beforeMiddlewares: any[] = [];
    /**
     *
     * @type {Array}
     * @private
     */
    @NotEnumerable()
    private _middlewares: any[] = [];
    /**
     *
     * @type {Array}
     * @private
     */
    @NotEnumerable()
    private _afterMiddlewares: any[] = [];
    /**
     * HTTP method required.
     */
    @NotEnumerable()
    private _httpMethod: string;
    /**
     * Route strategy.
     */
    @NotEnumerable()
    private _path: PathParamsType;
    /**
     * Endpoint inherited from parent class.
     */
    @NotEnumerable()
    private _inheritedEndpoint: EndpointMetadata;

    constructor(_provide: Type<any>, private _methodClassName: string) {
        super(_provide, _methodClassName, {});

        this._type = Metadata.getReturnType(this._target, this.methodClassName);
    }

    /**
     *
     * @returns {any[]}
     */
    get beforeMiddlewares(): any[] {
        return this._beforeMiddlewares;
    }

    /**
     *
     * @param value
     */
    set beforeMiddlewares(value: any[]) {
        this._beforeMiddlewares = value;
    }

    /**
     *
     * @returns {any[]}
     */
    get middlewares(): any[] {
        return this._middlewares;
    }

    /**
     *
     * @param value
     */
    set middlewares(value: any[]) {
        this._middlewares = value;
    }

    /**
     *
     * @returns {any[]}
     */
    get afterMiddlewares(): any[] {
        return this._afterMiddlewares;
    }

    /**
     *
     * @param value
     */
    set afterMiddlewares(value: any[]) {
        this._afterMiddlewares = value;
    }

    /**
     *
     * @returns {string}
     */
    get httpMethod(): string {
        return this._httpMethod;
    }

    /**
     *
     * @param value
     */
    set httpMethod(value: string) {
        this._httpMethod = value;
    }

    /**
     *
     * @returns {PathParamsType}
     */
    get path(): PathParamsType {
        return this._path;
    }

    /**
     *
     * @param value
     */
    set path(value: PathParamsType) {
        this._path = value;
    }

    get inheritedEndpoint(): EndpointMetadata {
        return this._inheritedEndpoint;
    }

    get type(): Type<any> {
        return isPromise(this._type) || isArrayOrArrayClass(this._type) || this._type === Object ? undefined! : this._type;
    }

    set type(type: Type<any>) {
        this._type = type;
    }

    /**
     *
     */
    get methodClassName(): string {
        return this._methodClassName;
    }

    /**
     *
     * @returns {Store}
     */
    get store(): Store {
        return this._inheritedEndpoint ? this._inheritedEndpoint.store : this._store;
    }

    /**
     *
     * @returns {boolean}
     */
    public hasHttpMethod(): boolean {
        return !!this._httpMethod;
    }

    public statusResponse(code: string | number) {
        const response = (this.store.get("responses") || {})[code] || {};
        this.type = response.type;
        this.collectionType = response.collectionType;
    }

    /**
     *
     * @param args
     * @returns {EndpointMetadata}
     */
    public before(args: any[]): this {
        this._beforeMiddlewares = this._beforeMiddlewares.concat(args);
        return this;
    }

    /**
     *
     * @param args
     * @returns {EndpointMetadata}
     */
    public after(args: any[]): this {
        this._afterMiddlewares = this._afterMiddlewares.concat(args);
        return this;
    }

    /**
     * Store all arguments collected via Annotation.
     * @param args
     */
    public merge(args: any[]): this {

        let filteredArg = args
            .filter((arg: any) => {

                if (typeof arg === "string") {

                    if (ENDPOINT_METHODS.indexOf(arg) > -1) {
                        this.httpMethod = arg;
                    } else {
                        this.path = arg;
                    }

                    return false;
                }

                return !!arg;
            });

        this.middlewares = this._middlewares.concat(filteredArg);

        return this;
    }

    /**
     *
     * @param {Type<any>} target
     */
    public inherit(target: Type<any>): EndpointMetadata {
        const metadata = new EndpointMetadata(target, this.methodClassName);
        metadata._inheritedEndpoint = this;
        metadata.middlewares = this.middlewares;
        metadata.afterMiddlewares = this.afterMiddlewares;
        metadata.beforeMiddlewares = this.beforeMiddlewares;
        metadata.httpMethod = this.httpMethod;
        metadata.path = this.path;
        metadata.type = this._type;
        return metadata;
    }

    /**
     * Get value for an endpoint method.
     * @param key
     */
    @Deprecated("Use endpointMetadata.store.get(key) instead of")
    public getMetadata(key: any): any {
        return this.store.get<any>(key);
    }
}
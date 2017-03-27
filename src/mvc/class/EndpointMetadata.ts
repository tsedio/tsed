/**
 * @module mvc
 */ /** */

import {PathParamsType} from "../interfaces/PathParamsType";
import {Type} from "../../core/interfaces/Type";
import {ENDPOINT_METHODS} from "../constants/index";
import {Metadata} from "../../core/class/Metadata";
import {getClass, nameOf} from "../../core/utils/index";
import {NotEnumerable} from "../../core/decorators/enumerable";
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
export class EndpointMetadata {
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

    constructor(private _provide: Type<any>, private _methodClassName: string) {
        this._provide = getClass(_provide);
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
     * @returns {boolean}
     */
    public hasHttpMethod(): boolean {
        return !!this._httpMethod;
    }

    /**
     *
     * @returns {any}
     */
    public get targetClass(): Type<any> {
        return this._provide;
    }

    /**
     *
     * @returns {Type<any>}
     */
    public get provide(): Type<any> {
        return this._provide;
    }

    /**
     *
     * @returns {string}
     */
    public get className(): string {
        return this.provide.name;
    }

    /**
     *
     */
    public get methodClassName(): string {
        return this._methodClassName;
    }

    /**
     *
     */
    public get returnType(): any {
        return Metadata.getReturnType(this.targetClass, this.methodClassName);
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
     * Get value for an endpoint method.
     * @param key
     */
    public getMetadata = (key: any) =>
        Metadata.get(nameOf(key), this.targetClass, this.methodClassName);

}
/**
 * @module mvc
 */
/** */
import {MiddlewareRegistry} from "../registries/MiddlewareRegistry";
import {ControllerRegistry} from "../registries/ControllerRegistry";
import {ParamsRegistry} from "../registries/ParamsRegistry";
import {MiddlewareType} from "../interfaces/Middleware";
import {ParamMetadata} from "./ParamMetadata";
import {NotEnumerable} from "../../core/decorators/enumerable";


export class HandlerMetadata {
    /**
     *
     */
    @NotEnumerable()
    private _type: "function" | "middleware" | "controller" = "function";
    /**
     *
     * @type {boolean}
     * @private
     */
    @NotEnumerable()
    private _errorParam: boolean = false;
    /**
     *
     */
    @NotEnumerable()
    private _injectable: boolean = false;
    /**
     *
     */
    @NotEnumerable()
    private _nextFunction: boolean;

    constructor(private _target: any, private _methodClassName?: string) {
        this.resolve();
    }

    /**
     *
     */
    private resolve() {

        let handler = this._target;

        if (MiddlewareRegistry.has(this._target)) {
            this._type = "middleware";
            this._errorParam = MiddlewareRegistry.get(this._target).type === MiddlewareType.ERROR;
            this._methodClassName = "use";
        }

        if (ControllerRegistry.has(this._target)) {
            this._type = "controller";
        }

        if (this._methodClassName) {
            this._injectable = ParamsRegistry.isInjectable(this._target, this._methodClassName);
            this._nextFunction = ParamsRegistry.hasNextFunction(this._target, this._methodClassName);

            handler = this._target.prototype[this._methodClassName];
        }

        if (!this._injectable) {
            this._errorParam = handler.length === 4;
            this._nextFunction = handler.length >= 3;
        }

    }

    get type() {
        return this._type;
    }

    get errorParam(): boolean {
        return this._errorParam;
    }

    get injectable(): boolean {
        return this._injectable;
    }

    get nextFunction(): boolean {
        return this._nextFunction;
    }

    get methodClassName(): string {
        return this._methodClassName;
    }

    get target(): any {
        return this._target;
    }

    get services(): ParamMetadata[] {
        return ParamsRegistry.getParams(this.target, this.methodClassName);
    }
}

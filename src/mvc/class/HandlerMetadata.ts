import {NotEnumerable} from "../../core/decorators";
import {ParamMetadata} from "../../filters/class/ParamMetadata";
import {EXPRESS_ERR, EXPRESS_NEXT_FN, EXPRESS_REQUEST, EXPRESS_RESPONSE} from "../../filters/constants";
import {ParamRegistry} from "../../filters/registries/ParamRegistry";
import {MiddlewareType} from "../interfaces";
import {ControllerRegistry} from "../registries/ControllerRegistry";
import {MiddlewareRegistry} from "../registries/MiddlewareRegistry";


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

    @NotEnumerable()
    private _useClass: any;

    constructor(private _target: any, private _methodClassName?: string) {
        this.resolve();
    }

    /**
     *
     */
    private resolve() {

        this._useClass = this._target;

        let handler = this._target;
        let target = this._target;

        if (MiddlewareRegistry.has(this._target)) {
            const middleware = MiddlewareRegistry.get(this._target)!;
            this._type = "middleware";
            this._errorParam = middleware.type === MiddlewareType.ERROR;
            this._methodClassName = "use";
            this._useClass = target = middleware.useClass;

        } else if (ControllerRegistry.has(this._target)) {
            this._type = "controller";
        }

        if (this._methodClassName) {
            this._injectable = ParamRegistry.isInjectable(target, this._methodClassName);
            this._nextFunction = ParamRegistry.hasNextFunction(target, this._methodClassName);

            handler = target.prototype[this._methodClassName];
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

    get methodClassName(): string | undefined {
        return this._methodClassName;
    }

    get target(): any {
        return this._target;
    }

    get services(): ParamMetadata[] {

        if (this.injectable) {
            return ParamRegistry.getParams(this._useClass, this.methodClassName);
        }

        let parameters: any[] = [{service: EXPRESS_REQUEST}, {service: EXPRESS_RESPONSE}];

        if (this.errorParam) {
            parameters.unshift({service: EXPRESS_ERR});
        }

        if (this.nextFunction) {
            parameters.push({service: EXPRESS_NEXT_FN});
        }

        return parameters;
    }
}

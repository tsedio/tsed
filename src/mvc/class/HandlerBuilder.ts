import * as Express from "express";
import {globalServerSettings} from "../../config";
import {CastError} from "../../core/errors/CastError";
import {nameOf} from "../../core/utils";
import {ProviderScope} from "../../di/interfaces";
import {InjectorService} from "../../di/services/InjectorService";
import {FilterBuilder} from "../../filters/class/FilterBuilder";
import {ParamMetadata} from "../../filters/class/ParamMetadata";
import {IFilterPreHandler} from "../../filters/interfaces/IFilterPreHandler";
import {ParseExpressionError} from "../errors/ParseExpressionError";
import {ControllerRegistry} from "../registries/ControllerRegistry";
import {MiddlewareRegistry} from "../registries/MiddlewareRegistry";
import {RouterController} from "../services/RouterController";
import {EndpointMetadata} from "./EndpointMetadata";
import {HandlerMetadata} from "./HandlerMetadata";

/**
 * @stable
 */
export class HandlerBuilder {

    private filters: any[];
    private _handler: Function;
    private _rebuildHandler: boolean = false;

    constructor(private handlerMetadata: HandlerMetadata) {
    }

    /**
     *
     * @param obj
     * @returns {HandlerBuilder}
     */
    static from(obj: any | EndpointMetadata) {
        if (obj instanceof EndpointMetadata) { // Endpoint
            return new HandlerBuilder(new HandlerMetadata(obj.target, obj.methodClassName));
        }
        // Middleware
        return new HandlerBuilder(new HandlerMetadata(obj));
    }

    /**
     *
     * @returns {any}
     */
    public build() {

        this.filters = this.handlerMetadata
            .services
            .map((param: ParamMetadata) =>
                new FilterBuilder().build(param)
            );

        if (this.handlerMetadata.errorParam) {
            return (err: any, request: any, response: any, next: any) =>
                this.invoke(request, response, next, err);
        } else {
            return (request: any, response: any, next: any) =>
                this.invoke(request, response, next);
        }
    }

    /**
     *
     * @returns {any}
     */
    private middlewareHandler(): Function {
        const provider = MiddlewareRegistry.get(this.handlerMetadata.target);

        /* istanbul ignore next */
        if (!provider) {
            throw new Error(`${nameOf(this.handlerMetadata.target)} middleware component not found in the MiddlewareRegistry`);
        }

        let instance = provider.instance;
        this._rebuildHandler = provider.scope !== ProviderScope.SINGLETON;

        if (this._rebuildHandler) {
            instance = InjectorService.invoke(provider.useClass, undefined, undefined, true);
        }

        return instance.use.bind(instance);
    }

    /**
     *
     * @param locals
     * @returns {any}
     */
    private endpointHandler<T>(locals: Map<string | Function, any> = new Map<string | Function, any>()): Function {

        const provider = ControllerRegistry.get(this.handlerMetadata.target);
        /* istanbul ignore next */
        if (!provider) {
            throw new Error("Controller component not found in the ControllerRegistry");
        }

        const target = provider.useClass;
        this._rebuildHandler = provider.scope !== ProviderScope.SINGLETON;

        if (this._rebuildHandler || provider.instance === undefined) {
            if (!locals.has(RouterController)) {
                locals.set(RouterController, new RouterController(provider.router));
            }

            provider.instance = InjectorService.invoke<T>(target, locals, undefined, true);
        }

        return provider.instance[this.handlerMetadata.methodClassName!].bind(provider.instance);
    }

    /**
     *
     */
    private getHandler(): Function {
        if (!this._rebuildHandler && this._handler) {
            return this._handler;
        }

        switch (this.handlerMetadata.type) {
            default:
            case "function":
                this._handler = this.handlerMetadata.target;
                break;
            case "middleware":
                this._handler = this.middlewareHandler();
                break;

            case "controller":
                this._handler = this.endpointHandler();
                break;
        }

        return this._handler;
    }

    /**
     *
     * @returns {Promise<TResult2|TResult1>}
     * @param request
     * @param response
     * @param next
     * @param err
     */
    private async invoke(request: Express.Request, response: Express.Response, next: any, err?: any): Promise<any> {
        next = this.buildNext(request, response, next);

        try {
            this.log(request, {event: "invoke.start"});
            const args = this.runFilters(request, response, next, err);
            const result = await this.getHandler()(...args);

            if (!next.isCalled) {
                if (this.handlerMetadata.type !== "function" && result !== undefined) {
                    request.storeData(result);
                }

                if (!this.handlerMetadata.nextFunction) {
                    next();
                }
            }
        } catch (err) {
            next(err);
        }
    }

    /**
     *
     * @param {Express.Request} request
     * @param o
     * @returns {string}
     */
    private log(request: Express.Request, o: any = {}) {
        if (request.id && globalServerSettings.debug) {
            const target = this.handlerMetadata.target;
            const injectable = this.handlerMetadata.injectable;
            const methodName = this.handlerMetadata.methodClassName;

            request.log.debug({
                type: this.handlerMetadata.type,
                target: (target ? nameOf(target) : target.name) || "anonymous",
                methodName,
                injectable,
                data: request && request.getStoredData ? request.getStoredData() : undefined,
                ...o
            });
        }
    }


    /**
     *
     * @param {Express.Request} request
     * @param {Express.Response} response
     * @param {Express.NextFunction} next
     * @returns {any}
     */
    private buildNext(request: Express.Request, response: Express.Response, next: any): any {
        next.isCalled = false;
        return (error?: any) => {
            next.isCalled = true;
            if (response.headersSent) {
                return;
            }

            /* istanbul ignore else */
            this.log(request, {event: "invoke.end", error});
            return next(error);
        };
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     * @param err
     */
    private runFilters(request: Express.Request, response: Express.Response, next: Express.NextFunction, err: any) {
        return this.filters
            .map((filter: IFilterPreHandler) => {
                try {
                    return filter({
                        request,
                        response,
                        next,
                        err
                    });
                } catch (err) {
                    const param: ParamMetadata = filter.param!;

                    if (param && err.name === "BAD_REQUEST") {
                        throw new ParseExpressionError(param.name, param.expression, err.message);
                    } else {
                        throw new CastError(err);
                    }
                }
            });
    }
}



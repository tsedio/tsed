/**
 * @module common/mvc
 */
/** */
import {$log} from "ts-log-debug";
import {ConverterService} from "../../converters/services/ConverterService";
import {CastError} from "../../core/errors/CastError";
import {Type} from "../../core/interfaces";
import {nameOf} from "../../core/utils";
import {InjectorService} from "../../di/services/InjectorService";
import {FilterService} from "../../filters/services/FilterService";
import {ENDPOINT_INFO, RESPONSE_DATA} from "../constants";
import {ParseExpressionError} from "../errors/ParseExpressionError";
import {RequiredParamError} from "../errors/RequiredParamError";
import {IHandlerScope} from "../interfaces/IHandlerScope";
import {ControllerRegistry} from "../registries/ControllerRegistry";
import {MiddlewareRegistry} from "../registries/MiddlewareRegistry";
import {RouterController} from "../services/RouterController";
import {EndpointMetadata} from "./EndpointMetadata";
import {HandlerMetadata} from "./HandlerMetadata";
import {ParamMetadata} from "./ParamMetadata";


/**
 * @stable
 */
export class HandlerBuilder {

    protected constructor(private handlerMetadata: HandlerMetadata) {
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

        if (this.handlerMetadata.errorParam) {
            return (err, request, response, next) => {
                return this.invoke({err, request, response, next});
            };

        } else {
            return (request, response, next) => {
                return this.invoke({request, response, next});
            };
        }
    }

    /**
     *
     * @returns {any}
     */
    private middlewareHandler(): Function {
        const provider = MiddlewareRegistry.get(this.handlerMetadata.target);
        return provider.instance.use.bind(provider.instance);
    }

    /**
     *
     * @param locals
     * @returns {any}
     */
    private endpointHandler = <T>(locals: Map<string | Function, any> = new Map<string | Function, any>()): Function => {

        const provider = ControllerRegistry.get(this.handlerMetadata.target);
        const target = provider.useClass;

        if (provider.scope || provider.instance === undefined) {

            if (!locals.has(RouterController)) {
                locals.set(RouterController, new RouterController(provider.router));
            }

            provider.instance = InjectorService.invoke<T>(target, locals);
        }

        return provider.instance[this.handlerMetadata.methodClassName].bind(provider.instance);
    };

    /**
     *
     * @returns {any}
     */
    private get handler(): Function {
        switch (this.handlerMetadata.type) {
            default:
            case "function":
                return this.handlerMetadata.target;

            case "middleware":
                return this.middlewareHandler();

            case "controller":
                return this.endpointHandler();
        }
    }

    /**
     *
     * @param locals
     */
    private localsToParams(locals: IHandlerScope) {

        if (this.handlerMetadata.injectable) {
            return this.getInjectableParameters(locals);
        }

        let parameters = [locals.request, locals.response];

        if (this.handlerMetadata.errorParam) {
            parameters.unshift(locals.err);
        }

        if (this.handlerMetadata.nextFunction) {
            parameters.push(locals.next);
        }

        return parameters;
    }


    /**
     *
     * @param locals
     * @returns {Promise<TResult2|TResult1>}
     */
    public async invoke(locals: IHandlerScope): Promise<any> {

        const {next, request, response} = locals;
        let nextCalled = false;
        const tagId = request.tagId;
        const target = this.handlerMetadata.target;
        const injectable = this.handlerMetadata.injectable;
        const methodName = this.handlerMetadata.methodClassName;
        let dataStored, parameters, isPromise: boolean;

        const info = (o = {}) => JSON.stringify({
            type: this.handlerMetadata.type,
            target: (target ? nameOf(target) : target.name) || "anonymous",
            methodName,
            injectable,
            data: dataStored,
            ...o
        });

        locals.next = (err?) => {
            nextCalled = true;
            if (response["headersSent"]) {
                $log.debug(request.tagId, "[INVOKE][END  ]", info({warn: "response already send"}));
                return;
            }

            /* istanbul ignore else */
            $log.debug(request.tagId, "[INVOKE][END  ]", info({error: err}));
            return next(err);
        };

        try {
            $log.debug(request.tagId, "[INVOKE][START]", info());

            const parameters = this.localsToParams(locals);
            const result = await (this.handler)(...parameters);

            if (!nextCalled) {
                if (this.handlerMetadata.type !== "function" && result !== undefined) {
                    locals.request.storeData(result);
                }

                if (!this.handlerMetadata.nextFunction) {
                    locals.next();
                }
            }


        } catch (err) {
            locals.next(err);
        }

    }

    /**
     *
     * @param localScope
     * @returns {[(any|EndpointMetadata|any|any),(any|EndpointMetadata|any|any),(any|EndpointMetadata|any|any),(any|EndpointMetadata|any|any),(any|EndpointMetadata|any|any)]}
     */
    private getInjectableParameters = (localScope?: IHandlerScope): any[] => {
        const converterService = InjectorService.get<ConverterService>(ConverterService);
        const filterService = InjectorService.get<FilterService>(FilterService);

        return this.handlerMetadata
            .services
            .map((param: ParamMetadata, index: number) => {


                let paramValue;

                if (param.name in localScope) {
                    return localScope[param.name];
                }

                if (param.service === ENDPOINT_INFO) {
                    return localScope["request"].getEndpoint();
                }

                if (param.service === RESPONSE_DATA) {
                    return localScope["request"].getStoredData();
                }

                if (filterService.has(param.service as Type<any>)) {
                    paramValue = filterService.invokeMethod(
                        param.service as Type<any>,
                        param.expression,
                        localScope.request,
                        localScope.response
                    );
                }

                if (param.required && (paramValue === undefined || paramValue === null)) {
                    throw new RequiredParamError(param.name, param.expression);
                }

                try {

                    if (param.useConverter) {
                        paramValue = converterService.deserialize(paramValue, param.type || param.collectionType, param.collectionType);
                    }

                } catch (err) {

                    /* istanbul ignore next */
                    if (err.name === "BAD_REQUEST") {
                        throw new ParseExpressionError(param.name, param.expression, err.message);
                    } else {
                        /* istanbul ignore next */
                        throw new CastError(err);
                    }
                }

                return paramValue;

            });

    };


}

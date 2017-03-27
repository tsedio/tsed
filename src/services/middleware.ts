import {BadRequest} from "ts-httpexceptions";
import {$log} from "ts-log-debug";

import {BAD_REQUEST_REQUIRED, BAD_REQUEST} from "../constants/errors-msgs";
import {getClass} from "../utils";
import {ServerSettingsService, EnvTypes} from "./server-settings";
import {
    IMiddlewareProvider, IMiddleware,
    IInjectableMiddlewareMethod, IInvokableScope, Type
} from "../interfaces/interfaces";

import {Service} from "../decorators/class/service";
import {MiddlewareType} from "../enums/MiddlewareType";
import EndpointParam from "../controllers/endpoint-param";
import ConverterService from "./converter";
import InjectorService from "./injector";
import FilterService from "./filter";
import {ENDPOINT_INFO, RESPONSE_DATA} from "../constants/metadata-keys";

@Service()
export default class MiddlewareService {

    private static middlewares: Map<any, IMiddlewareProvider<any>> = new Map<any, IMiddlewareProvider<any>>();

    constructor(
        private injectorService: InjectorService,
        private converterService: ConverterService,
        private filterService: FilterService,
        private serverSettings: ServerSettingsService
    ) {

    }

    /**
     *
     */
    $afterServicesInit() {

        if (this.serverSettings.env !== EnvTypes.TEST) {
            $log.info("[TSED] Import middlewares");
        }

        MiddlewareService.middlewares.forEach((settings, target) => {
            settings.instance = this.injectorService.invoke(target);

            MiddlewareService.middlewares.set(target, settings);
        });
    }

    /**
     * Set a middleware in the registry.
     * @param target
     * @param type
     */
    static set(target: any, type: MiddlewareType) {
        this.middlewares.set(target, {provide: target, useClass: target, type});
        return this;
    }

    /**
     * Get a middleware in the registry.
     * @param target
     * @returns {T}
     */
    static get<T extends IMiddleware>(target: Type<T>): IMiddlewareProvider<T> {
        return this.middlewares.get(getClass(target));
    }

    /**
     *
     * @param target
     * @returns {T}
     */
    static invoke<T extends IMiddleware>(target: Type<T>): T {
        return this.middlewares.get(getClass(target)).instance;
    }

    /**
     *
     * @param target
     * @returns {boolean}
     */
    static has(target: Type<any>): boolean {
        return this.middlewares.has(getClass(target));
    }

    /**
     *
     * @param target
     * @returns {T}
     */
    get = <T extends IMiddleware>(target: Type<T>): IMiddlewareProvider<T> =>
        MiddlewareService.get<T>(getClass(target));

    /**
     *
     * @param target
     */
    has = (target: Type<any>): boolean =>
        MiddlewareService.has(getClass(target));

    /**
     *
     * @param key
     * @param value
     * @returns {null}
     */
    set = (key: Type<any>, value?: IMiddlewareProvider<any>): this => {
        MiddlewareService.middlewares.set(getClass(key), value);
        return this;
    }

    /**
     *
     * @param callbackfn
     * @param thisArg
     */
    forEach = <T extends IMiddleware>(callbackfn: (value: IMiddlewareProvider<T>, index: any, map: Map<any, IMiddlewareProvider<any>>) => void, thisArg?: any): void  =>
        MiddlewareService.middlewares.forEach(callbackfn);

    /**
     *
     * @returns {number}
     */
    get size(): number {
        return MiddlewareService.middlewares.size;
    }

    /**
     *
     * @param target
     * @returns {T}
     */
    invoke<T extends IMiddleware>(target: any): T {
        return this.get<T>(target).instance;
    }

    /**
     * Create a configuration to call the target middleware.
     * @param target
     * @param methodName
     * @param handler
     * @returns {IInjectableMiddlewareMethod}
     */
    createSettings(target: any, methodName?: string, handler?: () => Function): IInjectableMiddlewareMethod {

        let injectable: boolean = false,
            type: MiddlewareType,
            hasNextFn: boolean = false,
            length: number = 3;

        if (MiddlewareService.has(target)) {
            const middleware = this.get(target);

            type = this.get(target).type;
            injectable = EndpointParam.isInjectable(target, "use");
            methodName = "use";

            handler = () => middleware.instance["use"].bind(middleware.instance);
            length = middleware.instance["use"].length;

        } else {

            if (target && target.prototype && target.prototype[methodName]) { // endpoint
                type = MiddlewareType.ENDPOINT;
                injectable = EndpointParam.isInjectable(target, methodName);
                length = target.prototype[methodName].length;

            } else {
                handler = () => target;
                type = target.length  === 4 ? MiddlewareType.ERROR : MiddlewareType.MIDDLEWARE;
                length = target.length;
            }

        }

        if (!injectable) {

            if (length === 4) {
                hasNextFn = true;
            } else if (length === 3) {
                hasNextFn = type !== MiddlewareType.ERROR;
            }
        } else {
            hasNextFn = EndpointParam.hasNextFunction(target, methodName);
        }

        return {
            length,
            target,
            methodName,
            handler,
            type,
            injectable,
            hasNextFn
        };
    }

    /**
     *
     * @param target
     * @param methodName
     * @param handler
     */
    bindMiddleware(target: any, methodName?: string, handler?: () => Function): Function {

        // middleware(req, res, next, err);
        // middleware(req, res, next);
        // middleware(req, res);
        //
        // Enpoint.middleware(request, response);
        // Enpoint.middleware(request, response, next);
        // Enpoint.middleware(...);
        //
        // Middleware.use(request, response);
        // Middleware.use(err, request, response, next);
        // Middleware.use(request, response, next);
        // Middleware.use(...);

        const settings = this.createSettings(target, methodName, handler);

        // Create Settings
        if (settings.type === MiddlewareType.ERROR) {
            return (err, request, response, next) => {
                return this.invokeMethod(settings, {err, request, response, next});
            };

        } else {
            return (request, response, next) => {
                return this.invokeMethod(settings, {request, response, next});
            };
        }

    }

    /**
     *
     * @param settings
     * @param localScope
     * @returns {any}
     */
    invokeMethod(settings: IInjectableMiddlewareMethod, localScope: IInvokableScope): any {

        let {
            target, methodName, injectable,
            type, handler, hasNextFn
        } = settings;

        const {next} = localScope;

        return new Promise((resolve, reject) => {

            let parameters, isPromise: boolean;

            localScope.next = reject;

            if (injectable) {
                parameters = this.getInjectableParameters(target, methodName, localScope);
            } else {
                parameters = [localScope.request, localScope.response];

                if (type === MiddlewareType.ERROR) {
                    parameters.unshift(localScope.err);
                }

                if (hasNextFn) {
                    parameters.push(localScope.next);
                }
            }

            Promise
                .resolve()
                .then(() => {
                     const result = handler()(...parameters);

                     isPromise = result && result.then;

                     return result;
                })
                .then((data) => {

                    if (data !== undefined) {
                        localScope.request.storeData(data);
                    }

                    if (!hasNextFn || isPromise) {
                        resolve();
                    }
                })
                .catch(reject);

        })
            .then(
                () => {
                    next();
                },
                (err) => {
                    next(err);
                }
            );

    }

    /**
     *
     * @param target
     * @param methodName
     * @param localScope
     */
    private getInjectableParameters = (target: any, methodName: string, localScope?: IInvokableScope): any[] => {
        const services = EndpointParam.getParams(target, methodName);

        return services
            .map((param: EndpointParam, index: number) => {

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

                if (this.filterService.has(param.service as Type<any>)) {
                    paramValue = this.filterService.invokeMethod(
                        param.service as Type<any>,
                        param.expression,
                        localScope.request,
                        localScope.response
                    );
                }

                if (param.required && (paramValue === undefined || paramValue === null)) {
                    throw new BadRequest(BAD_REQUEST_REQUIRED(param.name, param.expression));
                }

                try {

                    if (param.useConverter) {
                        paramValue = this.converterService.deserialize(paramValue, param.baseType || param.useType, param.useType);
                    }

                } catch (err) {

                    /* istanbul ignore next */
                    if (err.name === "BAD_REQUEST") {
                        throw new BadRequest(BAD_REQUEST(param.name, param.expression) + " " + err.message);
                    } else {
                        /* istanbul ignore next */
                        (() => {
                            const castedError = new Error(err.message);
                            castedError.stack = err.stack;
                            throw castedError;
                        })();
                    }
                }

                return paramValue;

            });

    }

}
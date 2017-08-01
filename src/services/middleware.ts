import {BadRequest} from "ts-httpexceptions";
import {$log} from "ts-log-debug";
import {BAD_REQUEST, BAD_REQUEST_REQUIRED} from "../constants/errors-msgs";
import {EXPRESS_NEXT_FN, INJECT_PARAMS} from "../constants/metadata-keys";
import {Service} from "../decorators/service";
import {IInvokableScope} from "../interfaces/InvokableScope";
import {IInjectableMiddlewareMethod, IMiddleware, IMiddlewareSettings, MiddlewareType} from "../interfaces/Middleware";
import {getClassName} from "../utils";
import {getClass} from "../utils/utils";
import ControllerService from "./controller";
import ConverterService from "./converter";
import InjectParams from "./inject-params";
import InjectorService from "./injector";
import Metadata from "./metadata";
import RequestService from "./request";
import ResponseService from "./response";
import {EnvTypes, ServerSettingsService} from "./server-settings";

@Service()
export default class MiddlewareService {

    private static middlewares: Map<any, IMiddlewareSettings<any>> = new Map<any, IMiddlewareSettings<any>>();

    constructor(private injectorService: InjectorService,
                private converterService: ConverterService,
                private serverSettings: ServerSettingsService) {

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
        this.middlewares.set(target, {type});
        return this;
    }

    /**
     * Get a middleware in the registry.
     * @param target
     * @returns {T}
     */
    static get<T extends IMiddleware>(target: any): IMiddlewareSettings<T> {
        return this.middlewares.get(target);
    }

    /**
     *
     * @param target
     * @returns {T}
     */
    static invoke<T extends IMiddleware>(target: any): IMiddlewareSettings<T> {
        return this.middlewares.get(target).instance;
    }

    /**
     *
     * @param target
     * @returns {boolean}
     */
    static has(target: any): boolean {
        return this.middlewares.has(getClass(target));
    }

    /**
     *
     * @param target
     * @returns {T}
     */
    get<T extends IMiddleware>(target: any): IMiddlewareSettings<T> {
        return MiddlewareService.get<T>(getClass(target));
    }

    invoke<T extends IMiddleware>(target: any): T {
        return this.get<T>(target).instance;
    }

    /**
     *
     * @param target
     * @param method
     */
    isInjectable = (target, method): boolean => (Metadata.get(INJECT_PARAMS, target, method) || []).length > 0;

    /**
     * Create a configuration to call the target middleware.
     * @param target
     * @param methodName
     * @returns {IInjectableMiddlewareMethod}
     */
    createSettings(target: any, methodName?: string): IInjectableMiddlewareMethod {

        let handler: () => Function,
            injectable: boolean = false,
            type: MiddlewareType,
            hasNextFn: boolean = false,
            length: number = 3;

        if (MiddlewareService.has(target)) {
            const middleware = this.get(target);

            type = this.get(target).type;
            injectable = this.isInjectable(target, "use");
            methodName = "use";

            handler = () => middleware.instance["use"].bind(middleware.instance);
            length = middleware.instance["use"].length;

        } else {

            if (target && target.prototype && target.prototype[methodName]) { // endpoint
                type = MiddlewareType.ENDPOINT;
                injectable = this.isInjectable(target, methodName);

                handler = () => {
                    const instance = this.injectorService.get<ControllerService>(ControllerService).invoke(target);
                    return instance[methodName].bind(instance);
                };
                length = target.prototype[methodName].length;

            } else {
                handler = () => target;
                type = target.length === 4 ? MiddlewareType.ERROR : MiddlewareType.MIDDLEWARE;
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
            hasNextFn = MiddlewareService
                    .getParams(target, methodName)
                    .findIndex((p) => p.service === EXPRESS_NEXT_FN) > -1;
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
     */
    bindMiddleware(target: any, methodName?: string): Function {

        const settings = this.createSettings(target, methodName);

        // Create Settings
        if (settings.type === MiddlewareType.ERROR) {
            return (err, request, response, next) => {
                this.invokeMethod(settings, {err, request, response, next});
            };

        } else {
            return (request, response, next) => {
                this.invokeMethod(settings, {request, response, next});
            };
        }

    }

    /**
     *
     * @param settings
     * @param localScope
     * @returns {any}
     */
    public invokeMethod(settings: IInjectableMiddlewareMethod, localScope: IInvokableScope): any {

        let {
            target, methodName, injectable,
            type, handler, hasNextFn
        } = settings;

        const {next, request} = localScope;
        const tagId = request.tagId;
        let dataStored, parameters, isPromise: boolean;
        let nextCalled = false;

        const info = (o = {}) => JSON.stringify({
            type: MiddlewareType[type],
            target: (target ? getClassName(target) : target.name) || "anonymous",
            methodName, injectable, hasNextFn,
            returnPromise: isPromise === undefined ? undefined : !!isPromise,
            data: dataStored,
            ...o
        });

        if (tagId) {
            $log.debug(request.tagId, "[INVOKE][START]", info());
        }

        return new Promise((resolve, reject) => {

            localScope.next = (err?) => {
                nextCalled = true;
                if (!localScope.response.headersSent) {
                    $log.debug(request.tagId, "[INVOKE][END  ]", info({error: err}));
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            };

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

                    if (!nextCalled) {
                        if (data !== undefined) {
                            dataStored = data;
                            localScope.request.storeData(data);
                        }

                        if (!hasNextFn || isPromise) {
                            localScope.next();
                        }
                    }

                })
                .catch(reject);

        })
            .then(() => {
                next();
            })
            .catch((err) => {

                if ((request as any).id) {
                    console.warn(tagId, "[INVOKE]", err);
                    // $log.warn(tagId, "[INVOKE]", err);
                }
                next(err);
            });

    }

    /**
     *
     * @param target
     * @param methodName
     * @param localScope
     */
    getInjectableParameters = (target: any, methodName: string, localScope?: IInvokableScope): any[] => {
        const services = MiddlewareService.getParams(target, methodName);
        const requestService = this.injectorService.get<RequestService>(RequestService);
        const responseService = this.injectorService.get<ResponseService>(ResponseService);

        return services
            .map((param: InjectParams, index: number) => {

                if (param.name in localScope) {
                    return localScope[param.name];
                }

                let paramValue;

                // TODO refactoring for the next version with filters
                /* istanbul ignore else */
                if (param.name in requestService) {
                    paramValue = requestService[param.name].call(requestService, localScope.request, param.expression);
                }

                // TODO refactoring for the next version with filters
                /* istanbul ignore else */
                if (param.name in responseService) {
                    paramValue = responseService[param.name].call(responseService, localScope.response, param.expression);
                }

                if (param.required && (paramValue === undefined || paramValue === null)) {
                    throw new BadRequest(BAD_REQUEST_REQUIRED(param.name, param.expression));
                }

                try {

                    if (param.useConverter) {
                        paramValue = this.converterService.deserialize(paramValue, param.baseType || param.use, param.use);
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

    };

    /**
     *
     * @param target
     * @param methodName
     */
    static getParams = (target: any, methodName: string): InjectParams[] => Metadata.get(INJECT_PARAMS, target, methodName);
}
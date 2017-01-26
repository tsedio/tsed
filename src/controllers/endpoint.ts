import * as Express from "express";
import {
    INJECT_PARAMS, EXPRESS_REQUEST, EXPRESS_RESPONSE, EXPRESS_NEXT_FN, RESPONSE_VIEW, DESIGN_PARAM_TYPES,
    RESPONSE_VIEW_OPTIONS, ENDPOINT_USE_BEFORE, ENDPOINT_USE_AFTER, ENDPOINT_ARGS
} from "../constants/metadata-keys";
import Metadata from "../services/metadata";
import {IInvokableScope} from "../interfaces/InvokableScope";
import {BadRequest} from "ts-httpexceptions";
import {InjectorService, RequestService} from "../services";
import InjectParams from "../services/inject-params";
import {BAD_REQUEST_REQUIRED, BAD_REQUEST} from "../constants/errors-msgs";
import ConverterService from "../services/converter";
import ControllerService from "../services/controller";
import {waiter} from "../utils/waiter";
import MiddlewareService from "../services/middleware";
import {getClassName} from "../utils/class";

export const METHODS = [
    "all", "checkout", "connect",
    "copy", "delete", "get",
    "head", "lock", "merge",
    "mkactivity", "mkcol", "move",
    "m-search", "notify", "options",
    "param", "patch", "post",
    "propfind", "propatch", "purge",
    "put", "report", "search",
    "subscribe", "trace", "unlock",
    "unsuscribe"
];
/**
 * Endpoint class contains metadata about a targetClass and his method.
 * Each annotation (@Get, @Body...) attached to a method are stored in a endpoint.
 * Endpoint convert this metadata to an array which contain arguments to call an Express method.
 *
 * Example :
 *
 *    @Controller("/my-path")
 *    class MyClass {
 *
 *        @Get("/")
 *        @Authenticated()
 *        public myMethod(){}
 *    }
 *
 * Annotation on MyClass.myMethod create a new Endpoint with his route "/",
 * the HTTP method GET and require granted connection to be accessible.
 */
export class Endpoint {

    /**
     *
     * @type {Array}
     */
    private middlewares: any[] = [];
    /**
     * HTTP method required.
     */
    private httpMethod: string;
    /**
     * Route strategy.
     */
    private route: string | RegExp;

    /**
     * Create an unique Endpoint manager for a targetClass and method.
     * @param _targetClass
     * @param _methodClassName
     */
    constructor(private _targetClass: any, private _methodClassName: string) {

        const args = Metadata.get(ENDPOINT_ARGS, _targetClass, _methodClassName) || [];
        this.push(args);

    }

    /**
     * Store all arguments collection via Annotation.
     * @param args
     */
    public push(args: any[]): void {

        let filteredArg = args
            .filter((arg: any) => {

                if (typeof arg === "string") {

                    if (METHODS.indexOf(arg) > -1) {
                        this.httpMethod = arg;
                    } else {
                        this.route = arg;
                    }

                    return false;
                }

                return !!arg;
            });

        this.middlewares = this.middlewares.concat(filteredArg);
    }

    /**
     * Endpoint has a HTTP method configured.
     * @returns {boolean}
     */
    public hasMethod(): boolean {
        return !!this.httpMethod;
    }

    /**
     * Return the http METHOD choosen for this endpoint.
     * @returns {string}
     */
    public getMethod(): string {
        return this.httpMethod;
    }

    /**
     *
     * @returns {string|RegExp}
     */
    public getRoute(): string | RegExp {
        return this.route;
    }

    /**
     * Transform endpoint to an array arguments for express router.
     * @returns {T[]}
     */
    public toArray(): any[] {

        const middlewareService = InjectorService.get<MiddlewareService>(MiddlewareService);
        const middlewaresBefore = Metadata.get(ENDPOINT_USE_BEFORE, this._targetClass, this._methodClassName) || [];
        const middlewaresAfter = Metadata.get(ENDPOINT_USE_AFTER, this._targetClass, this._methodClassName) || [];

        let middlewares: any[] = [this.httpMethod, this.route];

        middlewares = middlewares
            .concat(

                [
                    (request, response, next) => {
                        if (response.headersSent){
                           response.setHeader("X-Managed-By", "Express-router-decorators");
                        }

                        request['endpointInfo'] = this;
                    }
                ],

                middlewaresBefore.map(middleware => middlewareService.bindMiddleware(middleware)),

                this.middlewares.map(middleware => middlewareService.bindMiddleware(middleware)),

                [
                    middlewareService.bindMiddleware(this._targetClass, this._methodClassName)
                ],

                middlewaresAfter.map(middleware => middlewareService.bindMiddleware(middleware)),

                [
                    (request, response, next) => this.send(request, response, next)
                ]
            )
            .filter((item) => (!!item));

        return middlewares;
    }

    /**
     * Return middleware to express.
     * @param request
     * @param response
     * @param next
     * @returns {PromiseLike<TResult>|Promise<TResult>|IPromise<T>}
     */
    // public middleware = (request: Express.Request, response: Express.Response, next: Express.NextFunction): Promise<any> => {
    //
    //     const controllerService = InjectorService.get<ControllerService>(ControllerService);
    //     const middlewareService = InjectorService.get<MiddlewareService>(MiddlewareService);
    //     const instance = controllerService.invokeMethod(this.targetClass);
    //
    //
    //
    //
    //
    //     const fn = () =>
    //         this.invokeMethod(instance, {
    //             request,
    //             response,
    //             next
    //         });
    //
    //     return waiter(fn)
    //         .then(data => this.send(instance, data, {request, response, next}))
    //         .catch(err => next(err));
    // };

    /**
     * Try to get all parameters from Annotation.
     * @param localScope
     * @returns {(any|any)[]}
     */
    // private getParameters(localScope: IInvokableScope): any[] {
    //
    //     const converterService = InjectorService.get<ConverterService>(ConverterService);
    //
    //     return InjectorService
    //         .getMethodParameters(this.targetClass, this.methodClassName, localScope)
    //         .map((settings) => {
    //
    //             let {param, index, paramValue} = settings;
    //
    //             if (param.required && (paramValue === undefined || paramValue === null)) {
    //                 throw new BadRequest(BAD_REQUEST_REQUIRED(param.name, param.expression));
    //             }
    //
    //             try {
    //
    //                 paramValue = converterService.deserialize(paramValue, param.baseType || param.use, param.use);
    //
    //             } catch (err) {
    //
    //                 /* istanbul ignore next */
    //                 if (err.name === "BAD_REQUEST") {
    //                     throw new BadRequest(BAD_REQUEST(param.name, param.expression) + " " + err.message);
    //                 } else {
    //                     /* istanbul ignore next */
    //                     (() => {
    //                         const castedError = new Error(err.message);
    //                         castedError.stack = err.stack;
    //                         throw castedError;
    //                     })();
    //                 }
    //             }
    //
    //             return {param, index, paramValue};
    //         })
    // }

    /**
     *
     * @param instance
     * @param localScope
     * @returns {any}
     */
    // private invokeMethod(instance, localScope: IInvokableScope): any {
    //
    //     if (localScope.response.headersSent){
    //         localScope.response.setHeader("X-Managed-By", "Express-router-decorator");
    //     }
    //
    //     const targetKey = this.methodClassName;
    //     const parameters = this.getParameters(localScope);
    //
    //     /* instanbul ignore next */
    //     // SUPPORT OLD node version
    //     return Reflect.apply
    //         ? Reflect.apply(instance[targetKey], instance, parameters)
    //         : instance[targetKey].apply(instance, parameters);
    // }

    /**
     * Format data and send it to the client.
     * @returns {any}
     * @param request
     * @param response
     * @param next
     */
    private send = (request, response, next) => {

        const data = request["responseData"];

        if (response.headersSent) {
            return data;
        }

        // preset status code
        if (request.method === "POST") {
            response.status(201);
        }

        switch (typeof data) {
            case "number":
            case "boolean":
            case "string":
                response.send(data);
                break;

            default:

                if (data !== undefined) {
                    const converterService = InjectorService.get<ConverterService>(ConverterService);

                    response.setHeader("Content-Type", "text/json");
                    response.json(converterService.serialize(data));
                }

                break;
        }

        next();

    };

    /**
     *
     * @returns {boolean}
     * @param instance
     */
    // private hasImpliciteNextFunction(instance) {
    //
    //     let impliciteNext: boolean = false;
    //     const services = Metadata.get(INJECT_PARAMS, instance, this.methodClassName);
    //
    //     if (services) {
    //         impliciteNext = services.indexOf("next") === -1;
    //     } else {
    //         impliciteNext = instance[this.methodClassName].length < 3;
    //     }
    //
    //     return impliciteNext;
    // }

    /**
     *
     */
    public get methodClassName(): string {
        return this._methodClassName;
    }

    public get targetClass(): string {
        return this._targetClass;
    }

    /**
     *
     * @param target
     * @param method
     */
    static has = (target: any, method: string): boolean => Metadata.has(ENDPOINT_ARGS, target, method);
    /**
     *
     * @param key
     */
    public getMetadata = (key) => Metadata.get(key, this.targetClass, this.methodClassName)

}
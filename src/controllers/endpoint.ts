import * as Express from "express";
import {
    INJECT_PARAMS, EXPRESS_REQUEST, EXPRESS_RESPONSE, EXPRESS_NEXT_FN, ENDPOINT_VIEW, DESIGN_PARAM_TYPES,
    ENDPOINT_VIEW_OPTIONS, ENDPOINT_USE_BEFORE, ENDPOINT_USE_AFTER
} from "../constants/metadata-keys";
import Metadata from "../metadata/metadata";
import {IInvokableScope} from "../interfaces/InvokableScope";
import {BadRequest} from "ts-httpexceptions";
import {InjectorService, RequestService} from "../services";
import InjectParams from "../metadata/inject-params";
import {BAD_REQUEST_REQUIRED, BAD_REQUEST} from "../constants/errors-msgs";
import ConverterService from "../services/converter";
import ControllerService from "../services/controller";
import {waiter} from "../utils/waiter";
import MiddlewareService from "../services/middleware";

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
    private args: any[] = [];
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
     * @param targetClass
     * @param methodClassName
     */
    constructor(private targetClass: any, private methodClassName: string) {

    }

    /**
     * Store all arguments collection via Annotation.
     * @param args
     */
    public push(args: any[]): void {

        let filteredArg = args
            .filter((arg: any) => {

                /* istanbul ignore else */
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

        this.args = this.args.concat(filteredArg);
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

        const middlewareService = InjectorService.get(MiddlewareService);
        const middlewaresBefore = Metadata.get(ENDPOINT_USE_BEFORE, this.targetClass, this.methodClassName) || [];
        const middlewaresAfter = Metadata.get(ENDPOINT_USE_AFTER, this.targetClass, this.methodClassName) || [];

        const middlewares = []
            .concat(
                middlewaresBefore.map(middleware => middlewareService.bindMiddleware(middleware)),

                [this.middleware],

                middlewaresAfter.map(middleware => middlewareService.bindMiddleware(middleware))
            );

        return <any[]>[this.httpMethod, this.route]
            .concat(<any>this.args, middlewares)
            .filter((item) => (!!item));
    }

    /**
     * Return middleware to express.
     * @param request
     * @param response
     * @param next
     * @returns {PromiseLike<TResult>|Promise<TResult>|IPromise<T>}
     */
    public middleware = (request: Express.Request, response: Express.Response, next: Express.NextFunction): Promise<any> => {

        const controllerService = InjectorService.get(ControllerService);
        const instance = controllerService.invoke(this.targetClass);

        const fn = () =>
            this.invokeMethod(instance, {
                request,
                response,
                next
            });

        return waiter(fn)
            .then(data => this.send(instance, data, {request, response, next}))
            .catch(err => next(err));
    };

    /**
     * Try to get all parameters from Annotation.
     * @param localScope
     * @returns {(any|any)[]}
     */
    private getParameters(localScope: IInvokableScope): any[] {

        const requestService = InjectorService.get(RequestService);
        const converterService = InjectorService.get(ConverterService);

        let services:  InjectParams[] = Metadata.get(INJECT_PARAMS, this.targetClass, this.methodClassName);

        if (!services) {
            services = [EXPRESS_REQUEST, EXPRESS_RESPONSE, EXPRESS_NEXT_FN]
                .map((key: symbol) => {
                    let params = new InjectParams();

                    params.service = key;

                    return params;
                });
        }

        return services
            .map((param: InjectParams, index: number) => {

                if (param.name in localScope) {
                    return localScope[param.name];
                }

                let paramValue;

                /* istanbul ignore else */
                if (param.name in requestService) {
                    paramValue = requestService[param.name].call(requestService, localScope.request, param.expression);
                }

                if (param.required && (paramValue === undefined || paramValue === null)) {
                    throw new BadRequest(BAD_REQUEST_REQUIRED(param.name, param.expression));
                }

                try {

                    return converterService.deserialize(paramValue, param.baseType || param.use, param.use);

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

            });
    }

    /**
     *
     * @param instance
     * @param localScope
     * @returns {any}
     */
    private invokeMethod(instance, localScope: IInvokableScope): any {

        if (localScope.response.headersSent){
            localScope.response.setHeader("X-Managed-By", "Express-router-decorator");
        }

        const targetKey = this.methodClassName;
        const parameters = this.getParameters(localScope);

        /* instanbul ignore next */
        // SUPPORT OLD node version
        return Reflect.apply
            ? Reflect.apply(instance[targetKey], instance, parameters)
            : instance[targetKey].apply(instance, parameters);
    }

    /**
     * Format data and send it to the client.
     * @param instance
     * @param data
     * @param localScope
     * @returns {any}
     */
    private send = (instance, data, localScope: IInvokableScope) => {

        const impliciteNext = this.hasImpliciteNextFunction(instance);
        const request = localScope.request;
        const response = localScope.response;
        const next = localScope.next;

        const viewPath = Metadata.get(ENDPOINT_VIEW, instance, this.methodClassName);
        const viewOptions = Metadata.get(ENDPOINT_VIEW_OPTIONS, instance, this.methodClassName);

        if (response.headersSent) {
            return data;
        }

        if (viewPath !== undefined) {

            if (viewOptions !== undefined ) {
                data = Object.assign({}, data, viewOptions);
            }
            response.render(viewPath, data);
            return data;
        }

        // preset status code
        if (request.method === "POST") {
            response.status(201);
        }

        // TODO ADD New ANNOTATION TO SPECIFY RESPONSE FORMAT

        switch (typeof data) {
            case "number":
            case "boolean":
            case "string":
                response.send(data);
                break;

            default:

                if (data !== undefined) {
                    const converterService = InjectorService.get(ConverterService);

                    response.setHeader("Content-Type", "text/json");
                    response.json(converterService.serialize(data));
                }

                break;
        }

        if (impliciteNext) {
            next();
        }

        return data;
    };

    /**
     *
     * @returns {boolean}
     * @param instance
     */
    private hasImpliciteNextFunction(instance) {

        let impliciteNext: boolean = false;
        const services = Metadata.get(INJECT_PARAMS, instance, this.methodClassName);

        if (services) {
            impliciteNext = services.indexOf("next") === -1;
        } else {
            impliciteNext = instance[this.methodClassName].length < 3;
        }

        return impliciteNext;
    }

    /**
     *
     */
    public getMethodClassName = (): string => this.methodClassName;

}
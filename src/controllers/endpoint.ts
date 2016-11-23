import * as Express from "express";
import {INJECT_PARAMS, EXPRESS_REQUEST, EXPRESS_RESPONSE, EXPRESS_NEXT_FN} from "../constants/metadata-keys";
import Metadata from "../metadata/metadata";
import {IInvokableScope} from "../interfaces/InvokableScope";
import {BadRequest} from "ts-httpexceptions";
import {InjectorService, RequestService} from "../services";
import InjectParams from "../metadata/inject-params";
import {BAD_REQUEST_REQUIRED} from "../constants/errors-msgs";

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
 * Endpoint convert this metadata to an array wich contain arguments to call an Express method.
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
     * @param controller
     * @param methodClassName
     */
    constructor(private controller: {getInstance: () => any}, private methodClassName: string) {

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

                /* if (arg instanceof RegExp) {

                 this.route = arg;

                 return false;
                 }*/

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

        return <any[]>[this.httpMethod, this.route]
            .concat(<any>this.args, [
                <any>this.middleware
            ])
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

        let result: any;
        const instance = this.controller.getInstance();

        response.setHeader("X-Managed-By", "Express-router-decorator");

        return new Promise<any>((resolve, reject) => {

            result = this.invokeMethod(instance, {
                request,
                response,
                next
            });

            if (result && result.then) {
                result.then(resolve, reject);
            } else {
                resolve(result);
            }

        })
            .then(
                data => this.send(data, request, response, next, this.hasImpliciteNextFunction(instance)),
                err => {
                    next(err);
                }
            );
    };

    /**
     * Try to get all parameters from Annotation.
     * @param instance
     * @param localScope
     * @returns {(any|any)[]}
     */
    private getParameters(instance, localScope): any[] {

        const requestService = InjectorService.get(RequestService);

        let services:  InjectParams[] = Metadata.get(INJECT_PARAMS, instance, this.methodClassName);

        if (!services) {
            services = [EXPRESS_REQUEST, EXPRESS_RESPONSE, EXPRESS_NEXT_FN]
                .map((key: symbol) => {
                    let params = new InjectParams();

                    params.service = key;

                    return params;
                });
        }


        return services
            .map((param: InjectParams) => {

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

                return paramValue;
            });
    }

    /**
     *
     * @param instance
     * @param targetKey
     * @param localScope
     * @returns {any}
     */
    private invokeMethod(instance, localScope: IInvokableScope): any {

        const targetKey = this.methodClassName;
        const parameters = this.getParameters(instance, localScope);

        /* instanbul ignore next */
        // TODO SUPPORT OLD node version
        return Reflect.apply
            ? Reflect.apply(instance[targetKey], instance, parameters)
            : instance[targetKey].apply(instance, parameters);
    }

    /**
     * Format data and send it to the client.
     * @param data
     * @param request
     * @param response
     * @param next
     * @param impliciteNext
     * @returns {any}
     */
    private send = (data, request, response, next, impliciteNext) => {

        // preset status code
        if (request.method === "POST") {
            response.status(201);
        }

        // TODO ADD New ANNOTATION TO SPECIFY RESPONSE FORMAT

        switch(typeof data) {
            case "number":
            case "boolean":
            case "string":
                response.send(data);
                break;

            default:

                if (data !== undefined) {
                    response.setHeader("Content-Type", "text/json");
                    response.json(data);
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
     * @param targetKey
     * @returns {boolean}
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
}
import Promise = require("bluebird");
import * as Express from "express";
import {invoke} from "./invoke";
import {INJECT_SERV} from '../constants/metadata-keys';
import Metadata from '../metadata/metadata';

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
 *    @Controller('/my-path')
 *    class MyClass {
 *
 *        @Get('/')
 *        @Authenticated()
 *        public myMethod(){}
 *    }
 *
 * Annotation on MyClass.myMethod create a new Endpoint with his route '/',
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
    constructor(private controller: {getInstance:() => any}, private methodClassName: string) {

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
     * Return invokable function from targetClass.
     */
    /*private getInvokable = (): IInvokableFunction =>
        typeof this.methodClassName === "string"
            ? <IInvokableFunction>this.targetClass[this.methodClassName]
            : <IInvokableFunction>this.methodClassName;*/

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

            result = invoke(instance, this.methodClassName, {
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
                    next(err)
                }
            );
    };

    /**
     *
     * @param data
     * @returns {any}
     */
    private send = (data, request, response, next, impliciteNext) => {

        //console.log('send data =>', data);
        // preset status code
        if (request.method === "POST") {
            response.status(201);
        }

        // TODO ADD New ANNOTATION TO SPECIFY RESPONSE FORMAT
        if (data !== undefined) {
            response.setHeader("Content-Type", "text/json");
            response.json(data);
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
        const services = Metadata.get(INJECT_SERV, instance, this.methodClassName);

        if(services) {
            impliciteNext = services.indexOf("next") === -1;
        } else {
            impliciteNext = instance[this.methodClassName].length < 3;
        }

        return impliciteNext;
    }
}
import Promise = require("bluebird");
import * as Express from "express";
import {invoke} from "./invoke";
import {IInvokableFunction} from "../interfaces/InvokableFunction";
import {IInvokedFNResult} from "../interfaces/InvokedFnResult";

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

export class Endpoint {
    /**
     * 
     */
    private handler: Function;
    /**
     * 
     * @type {Array}
     */
    private args: any[] = [];
    /**
     * 
     */
    private method: string;
    /**
     * 
     */
    private route: string | RegExp;

    /**
     * Create new Endpoint manager for a class + method
     * @param targetClass
     * @param methodClassName
     */
    constructor(private targetClass: Function, private methodClassName: string) {
        this.promisify();
    }

    /**
     * add new endpoints
     * @param args
     */
    public push(args: any[]): void {

        let filteredArg = args
            .filter((arg: any) => {

                /* istanbul ignore else */
                if (typeof arg === "string") {

                    if (METHODS.indexOf(arg) > -1) {
                        this.method = arg;
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
     * 
     * @returns {boolean}
     */
    public hasMethod(): boolean {
        return !!this.method;
    }

    /**
     * 
     * @returns {string}
     */
    public getMethod(): string {
        return this.method;
    }

    /**
     * 
     * @returns {T[]}
     */
    public toArray(): any[] {

        return <any[]>[this.method, this.route]
            .concat(<any>this.args, [<any>this.handler])
            .filter((item) => (!!item));
    }

    /**
     *
     */
    private getInvokable = (): IInvokableFunction =>
        typeof this.methodClassName === "string"
            ? <IInvokableFunction>this.targetClass[this.methodClassName]
            : <IInvokableFunction>this.methodClassName;

    /**
     *
     */
    private promisify() {

        this.handler = <Function> (request: Express.Request, response: Express.Response, next: Express.NextFunction): Promise<any> => {

            let fnInvResult: IInvokedFNResult;

            response.setHeader("X-Managed-By", "Express-router-decorator");
            response.setHeader("Content-Type", "text/json");

            // preset status code
            if (request.method === "POST") {
                response.status(201);
            }

            return new Promise<any>((resolve, reject) => {

                const method: IInvokableFunction = this.getInvokable();

                fnInvResult = invoke(this.targetClass, method, {
                    request:    request,
                    response:   response,
                    next:       next
                });

                if (fnInvResult.result && fnInvResult.result.then) {
                    fnInvResult.result.then(resolve, reject);
                } else {
                    resolve(fnInvResult.result);
                }

            })
                .then((data) => {
                    if (data) {
                        response.json(data);
                    }

                    if (fnInvResult.impliciteNext) {
                        next();
                    }

                    return data;

                }, (err) => {
                    next(err);
                });
        };
    }
}
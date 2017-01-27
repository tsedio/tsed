import {
    ENDPOINT_USE_BEFORE, ENDPOINT_USE_AFTER, ENDPOINT_ARGS
} from "../constants/metadata-keys";
import Metadata from "../services/metadata";
import {InjectorService} from "../services";
import ConverterService from "../services/converter";
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
        return this.getMethod() ? (this.route || "/") : undefined;
    }

    /**
     * Transform endpoint to an array arguments for express router.
     * @returns {T[]}
     */
    public getMiddlewares(): any[] {

        const middlewareService = InjectorService.get<MiddlewareService>(MiddlewareService);
        const middlewaresBefore = Metadata.get(ENDPOINT_USE_BEFORE, this._targetClass, this._methodClassName) || [];
        const middlewaresAfter = Metadata.get(ENDPOINT_USE_AFTER, this._targetClass, this._methodClassName) || [];

        let middlewares: any[] = [];

        middlewares.push(this.onRequest);

        /* BEFORE */
        middlewares = middlewares
            .concat(middlewaresBefore.map(middleware => middlewareService.bindMiddleware(middleware)))
            .concat(this.middlewares.map(middleware => middlewareService.bindMiddleware(middleware)));

        /* METHOD */
        middlewares.push(middlewareService.bindMiddleware(this._targetClass, this._methodClassName));

        /* AFTER */
        middlewares = middlewares
            .concat(middlewaresAfter.map(middleware => middlewareService.bindMiddleware(middleware)));

        /* SEND */
        middlewares.push((request, response, next) => this.send(request, response, next));

        return middlewares.filter((item) => (!!item));
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    private onRequest = (request, response, next) => {

        if (!response.headersSent) {
            response.setHeader("X-Managed-By", "Express-router-decorators");
        }

        request["endpointInfo"] = this;
        next();
    };

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
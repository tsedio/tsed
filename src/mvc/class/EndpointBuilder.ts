import {EndpointMetadata} from "./EndpointMetadata";
import {SendResponseMiddleware} from "../components/SendResponseMiddleware";
import * as Express from "express";
import {HandlerBuilder} from "./HandlerBuilder";
import {$log} from "ts-log-debug";
import {nameOf} from "../../core/utils/index";

export class EndpointBuilder {

    constructor(private endpoint: EndpointMetadata,
                private router: Express.Router) {
        // console.log("Create endpoint =>", endpoint.className + "." + endpoint.methodClassName);
    }

    /**
     *
     * @returns {any[]}
     * @param invokable
     */
    build() {

        const endpoint = this.endpoint;
        let middlewares: any[] = []
            .concat(endpoint.beforeMiddlewares)
            .concat(endpoint.middlewares)
            .concat([endpoint])
            .concat(endpoint.afterMiddlewares)
            .concat(SendResponseMiddleware)
            .filter((item) => (!!item))
            .map(middleware => HandlerBuilder.from(middleware).build());

        middlewares = [this.onRequest()].concat(middlewares);

        this.routeMiddlewares(middlewares);

        return middlewares;
    }

    /**
     *
     * @param middlewares
     */
    private routeMiddlewares(middlewares: any[]) {
        if (this.endpoint.hasHttpMethod() && this.router[this.endpoint.httpMethod]) {
            this.router[this.endpoint.httpMethod](this.endpoint.path, ...middlewares);
        } else {
            const args: any[] = [this.endpoint.path].concat(middlewares).filter(o => !!o);
            this.router.use(...args);
        }
    }

    /**
     *
     */
    private onRequest = () =>
        (request, response, next) => {

            /* istanbul ignore else */
            if (request.id) {
                $log.debug(request.tagId, "Endpoint =>", JSON.stringify({
                    target: nameOf(this.endpoint.targetClass),
                    methodClass: this.endpoint.methodClassName,
                    httpMethod: this.endpoint.httpMethod
                }));
            }

            if (!response.headersSent) {
                response.setHeader("X-Managed-By", "TS-Express-Decorators");
            }

            request.getEndpoint = () => this.endpoint;

            request.storeData = function (data) {
                this._responseData = data;
                return this;
            };

            request.getStoredData = function (data) {
                return this._responseData;
            };

            next();
        };
}
import {globalServerSettings} from "../../config";
import {nameOf} from "../../core/utils";
import {SendResponseMiddleware} from "../components/SendResponseMiddleware";
import {EndpointMetadata} from "./EndpointMetadata";
import {HandlerBuilder} from "./HandlerBuilder";
/**
 *
 */
export class EndpointBuilder {
    constructor(private endpoint: EndpointMetadata,
                private router: any) {
    }

    /**
     *
     */
    private onRequest = () =>
        (request: any, response: any, next: any) => {

            /* istanbul ignore else */
            if (request.id && globalServerSettings.debug) {
                request.log.debug({
                    event: "attach.endpoint",
                    target: nameOf(this.endpoint.target),
                    methodClass: this.endpoint.methodClassName,
                    httpMethod: this.endpoint.httpMethod
                });
            }

            request.setEndpoint(this.endpoint);
            next();
        };

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
     * @returns {any[]}
     * @param invokable
     */
    build() {
        const endpoint = this.endpoint;

        let middlewares: any = []
            .concat(endpoint.beforeMiddlewares as any)
            .concat(endpoint.middlewares as any)
            .concat([endpoint] as any)
            .concat(endpoint.afterMiddlewares as any)
            .concat(SendResponseMiddleware as any)
            .filter((item: any) => (!!item))
            .map((middleware: any) => HandlerBuilder.from(middleware).build());

        middlewares = [this.onRequest()].concat(middlewares);

        this.routeMiddlewares(middlewares);

        return middlewares;
    }
}
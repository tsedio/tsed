import {InjectorService} from "@tsed/common";
import {nameOf} from "@tsed/core";
import {globalServerSettings} from "../../config";
import {SendResponseMiddleware} from "../components/SendResponseMiddleware";
import {EndpointMetadata} from "./EndpointMetadata";
import {HandlerBuilder} from "./HandlerBuilder";

/**
 *
 */
export class EndpointBuilder {
  constructor(private endpoint: EndpointMetadata, private router: any) {
  }

  /**
   *
   */
  private onRequest(endpoint: EndpointMetadata) {
    return (request: any, response: any, next: any) => {
      /* istanbul ignore else */
      if (request.id && globalServerSettings.debug) {
        request.log.debug({
          event: "attach.endpoint",
          target: nameOf(endpoint.target),
          methodClass: endpoint.methodClassName,
          httpMethod: request.method
        });
      }

      request.setEndpoint(endpoint);
      next();
    };
  }

  /**
   *
   * @param middlewares
   */
  private routeMiddlewares(middlewares: any[]) {
    this.endpoint.pathsMethods.forEach(({path, method}) => {
      if (!!method && this.router[method]) {
        this.router[method](path, ...middlewares);
      } else {
        const args: any[] = [path].concat(middlewares);
        this.router.use(...args);
      }
    });

    if (!this.endpoint.pathsMethods.length) {
      this.router.use(...middlewares);
    }
  }

  /**
   *
   * @returns {any[]}
   * @param injector
   */
  build(injector: InjectorService) {
    const endpoint = this.endpoint;

    let middlewares: any = []
      .concat(endpoint.beforeMiddlewares as any)
      .concat(endpoint.middlewares as any)
      .concat([endpoint] as any)
      .concat(endpoint.afterMiddlewares as any)
      .concat(SendResponseMiddleware as any)
      .filter((item: any) => !!item)
      .map((middleware: any) => HandlerBuilder.from(middleware).build(injector));

    middlewares = [this.onRequest(endpoint)].concat(middlewares);

    this.routeMiddlewares(middlewares);

    return middlewares;
  }
}

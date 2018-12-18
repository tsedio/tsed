import {applyBefore, nameOf} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {SendResponseMiddleware} from "../components/SendResponseMiddleware";
import {EndpointMetadata} from "./EndpointMetadata";
import {HandlerBuilder} from "./HandlerBuilder";

/**
 *
 */
export class EndpointBuilder {
  constructor(private endpoint: EndpointMetadata, private router: any) {}

  /**
   *
   */
  private bindRequest(endpoint: EndpointMetadata, debug: boolean) {
    return (request: any, response: any, next: any) => {
      /* istanbul ignore else */
      if (request.id && debug) {
        request.log.debug({
          event: "bind.request",
          target: nameOf(endpoint.target),
          methodClass: endpoint.methodClassName,
          httpMethod: request.method
        });
      }

      request.createContainer();
      request.setEndpoint(endpoint);

      applyBefore(response, "end", () => this.unbindRequest(endpoint, debug, request));

      next();
    };
  }

  private unbindRequest(endpoint: EndpointMetadata, debug: boolean, request: any) {
    /* istanbul ignore next */
    if (request.id && debug) {
      request.log.debug({
        event: "unbind.request",
        target: nameOf(endpoint.target),
        methodClass: endpoint.methodClassName,
        httpMethod: request.method
      });
    }

    try {
      request.destroyContainer();
      request.destroyEndpoint();
    } catch (error) {
      request.log.error({
        error: {
          message: "Unable to clean request. " + error.message,
          stack: error.stack
        }
      });
    }
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
    const debug = injector.settings.debug;

    let middlewares: any = []
      .concat(endpoint.beforeMiddlewares as any)
      .concat(endpoint.middlewares as any)
      .concat([endpoint] as any)
      .concat(endpoint.afterMiddlewares as any)
      .concat(SendResponseMiddleware as any)
      .filter((item: any) => !!item)
      .map((middleware: any) => HandlerBuilder.from(middleware).build(injector));

    middlewares = [this.bindRequest(endpoint, debug)].concat(middlewares);

    this.routeMiddlewares(middlewares);

    return middlewares;
  }
}

import {nameOf} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {EndpointMetadata} from "./EndpointMetadata";
import {HandlerBuilder} from "./HandlerBuilder";

/**
 *
 */
export class EndpointBuilder {
  constructor(private endpoint: EndpointMetadata) {}

  /**
   *
   * @returns {any[]}
   * @param injector
   */
  build(injector: InjectorService) {
    const {endpoint} = this;
    const {beforeMiddlewares, middlewares: mldwrs, afterMiddlewares} = endpoint;

    let middlewares: any = []
      .concat(beforeMiddlewares as any)
      .concat(mldwrs as any)
      .concat(endpoint as any)
      .concat(afterMiddlewares as any)
      .filter((item: any) => !!item)
      .map((middleware: any) => HandlerBuilder.from(middleware).build(injector));

    middlewares = [this.bindRequest(endpoint, injector)].concat(middlewares);

    this.routeMiddlewares(middlewares, injector);

    return middlewares;
  }

  /**
   *
   */
  private bindRequest(endpoint: EndpointMetadata, injector: InjectorService) {
    return (request: any, response: any, next: any) => {
      const debug = injector.settings.debug;
      /* istanbul ignore else */
      if (debug) {
        request.log.debug({
          event: "bind.request",
          target: nameOf(endpoint.target),
          methodClass: endpoint.methodClassName,
          httpMethod: request.method
        });
      }

      request.ctx.endpoint = endpoint;

      next();
    };
  }

  /**
   *
   * @param middlewares
   * @param injector
   */
  private routeMiddlewares(middlewares: any[], injector: InjectorService) {
    const {pathsMethods, target} = this.endpoint;
    const {router} = injector.getProvider(target)!;

    pathsMethods.forEach(({path, method}) => {
      if (!!method && router[method]) {
        router[method](path, ...middlewares);
      } else {
        const args: any[] = [path].concat(middlewares);
        router.use(...args);
      }
    });

    if (!pathsMethods.length) {
      router.use(...middlewares);
    }
  }
}

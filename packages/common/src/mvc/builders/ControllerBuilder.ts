import {Type} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import * as Express from "express";
import {ControllerProvider} from "../models/ControllerProvider";
import {EndpointMetadata} from "../models/EndpointMetadata";
import {bindEndpointMiddleware} from "../components/bindEndpointMiddleware";
import {SendResponseMiddleware} from "../components/SendResponseMiddleware";
import {IPathMethod} from "../interfaces/IPathMethod";
import {HandlerBuilder} from "./HandlerBuilder";

export class ControllerBuilder {
  constructor(private provider: ControllerProvider) {}

  /**
   *
   * @returns {any}
   */
  public build(injector: InjectorService): Express.Router {
    const {
      routerOptions,
      middlewares: {useBefore, useAfter}
    } = this.provider;

    // TODO Use injector create new router instance
    const defaultRoutersOptions = injector.settings.routers;
    this.provider.router = Express.Router(Object.assign({}, defaultRoutersOptions, routerOptions));

    // Controller lifecycle
    this.buildMiddlewares(injector, useBefore) // Controller before-middleware
      .buildEndpoints(injector) // All endpoints and his middlewares
      .buildMiddlewares(injector, useAfter) // Controller after-middleware
      .buildChildrenCtrls(injector); // Children controllers

    return this.provider.router;
  }

  private buildEndpoints(injector: InjectorService) {
    const {endpoints} = this.provider;
    const pathsMethodsMap: Map<string, IPathMethod> = new Map();

    endpoints.forEach(({pathsMethods}) => {
      pathsMethods.forEach(pathMethod => {
        pathMethod.method = pathMethod.method || "use";

        if (pathMethod.method !== "use") {
          const key = pathMethod.method + "-" + pathMethod.path;

          if (pathsMethodsMap.has(key)) {
            pathsMethodsMap.get(key)!.isFinal = false;
          }

          pathMethod.isFinal = true;
          pathsMethodsMap.set(key, pathMethod);
        }
      });
    });

    endpoints.forEach(endpoint => {
      this.buildEndpoint(injector, endpoint);
    });

    return this;
  }

  private buildEndpoint(injector: InjectorService, endpoint: EndpointMetadata) {
    const {beforeMiddlewares, middlewares: mldwrs, afterMiddlewares, pathsMethods} = endpoint;
    const {
      router,
      middlewares: {use}
    } = this.provider;
    // Endpoint lifecycle
    let handlers: any[] = [];

    handlers = handlers
      .concat(bindEndpointMiddleware(endpoint))
      .concat(use) // Controller use-middlewares
      .concat(beforeMiddlewares) // Endpoint before-middlewares
      .concat(mldwrs) // Endpoint middlewares
      .concat(endpoint) // Endpoint handler
      .concat(afterMiddlewares) // Endpoint after-middlewares
      .filter((item: any) => !!item)
      .map((middleware: any) => HandlerBuilder.from(middleware).build(injector));

    const sendResponse = HandlerBuilder.from(SendResponseMiddleware).build(injector);

    // Add handlers to the router
    pathsMethods.forEach(({path, method, isFinal}) => {
      const localHandlers = isFinal ? handlers.concat(sendResponse) : handlers;

      router[method!](path, ...localHandlers);
    });

    if (!pathsMethods.length) {
      router.use(...handlers);
    }
  }

  private buildChildrenCtrls(injector: InjectorService) {
    const {children, router} = this.provider;

    children.forEach((child: Type<any>) => {
      const provider = injector.getProvider(child) as ControllerProvider;

      /* istanbul ignore next */
      if (!provider) {
        throw new Error("Controller component not found in the ControllerRegistry");
      }

      new ControllerBuilder(provider).build(injector);

      router.use(provider.path, provider.router);
    });
  }

  private buildMiddlewares(injector: InjectorService, middlewares: any[]) {
    const {router} = this.provider;

    middlewares
      .filter(o => typeof o === "function")
      .forEach((middleware: any) => {
        router.use(HandlerBuilder.from(middleware).build(injector));
      });

    return this;
  }
}

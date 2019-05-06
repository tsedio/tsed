import {Type} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import * as Express from "express";
import {ControllerProvider} from "../class/ControllerProvider";
import {EndpointMetadata} from "../class/EndpointMetadata";
import {bindEndpointMiddleware} from "../components/bindEndpointMiddleware";
import {SendResponseMiddleware} from "../components/SendResponseMiddleware";
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
      .buildSendResponse(injector) // Final middleware to send response
      .buildChildrenCtrls(injector); // Children controllers

    return this.provider.router;
  }

  private buildEndpoints(injector: InjectorService) {
    const {endpoints} = this.provider;

    endpoints.forEach((endpoint: EndpointMetadata) => this.buildEndpoint(injector, endpoint));

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
      .concat(use) // Controller use-middlewares
      .concat(beforeMiddlewares) // Endpoint before-middlewares
      .concat(mldwrs) // Endpoint middlewares
      .concat(endpoint) // Endpoint handler
      .concat(afterMiddlewares) // Endpoint after-middlewares
      .filter((item: any) => !!item)
      .map((middleware: any) => HandlerBuilder.from(middleware).build(injector));

    handlers = [bindEndpointMiddleware(endpoint)].concat(handlers);

    // Add handlers to the router
    pathsMethods.forEach(({path, method}) => {
      if (!!method && router[method]) {
        router[method](path, ...handlers);
      } else {
        const args: any[] = [path].concat(handlers);
        router.use(...args);
      }
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

  private buildSendResponse(injector: InjectorService) {
    return this.buildMiddlewares(injector, [SendResponseMiddleware]);
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

import {Type} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import * as Express from "express";
import {SendResponseMiddleware} from "../components/SendResponseMiddleware";
import {ControllerProvider} from "./ControllerProvider";
import {EndpointBuilder} from "./EndpointBuilder";
import {HandlerBuilder} from "./HandlerBuilder";

export class ControllerBuilder {
  constructor(private provider: ControllerProvider) {}

  /**
   *
   * @returns {any}
   */
  build(injector: InjectorService): this {
    const {
      routerOptions,
      middlewares: {useBefore, useAfter}
    } = this.provider;
    const defaultRoutersOptions = injector.settings.routers;

    // TODO Use injector create new router instance
    this.provider.router = Express.Router(Object.assign({}, defaultRoutersOptions, routerOptions));

    this.buildMiddlewares(injector, useBefore!)
      .buildEndpoints(injector)
      .buildMiddlewares(injector, useAfter!)
      .buildSendResponse(injector)
      .buildDependencies(injector);

    return this;
  }

  private buildEndpoints(injector: InjectorService) {
    const {endpoints} = this.provider;

    endpoints.forEach(endpoint => {
      new EndpointBuilder(endpoint).build(injector);
    });

    return this;
  }

  private buildDependencies(injector: InjectorService) {
    const {dependencies, router} = this.provider;

    dependencies.forEach((child: Type<any>) => {
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
      .forEach((middleware: any) => router.use(HandlerBuilder.from(middleware).build(injector)));

    return this;
  }
}

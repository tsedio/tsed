import {Type} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import * as Express from "express";
import {IRouterSettings} from "../../config/interfaces/IServerSettings";
import {ControllerProvider} from "./ControllerProvider";

import {EndpointBuilder} from "./EndpointBuilder";
import {HandlerBuilder} from "./HandlerBuilder";

export class ControllerBuilder {
  constructor(private provider: ControllerProvider, private defaultRoutersOptions: IRouterSettings = {}) {
    this.provider.router = Express.Router(Object.assign({}, defaultRoutersOptions, this.provider.routerOptions));
  }

  /**
   *
   * @returns {any}
   */
  build(injector: InjectorService): this {
    const ctrl = this.provider;
    this.buildMiddlewares(injector, this.provider.middlewares.useBefore!);

    ctrl.endpoints.forEach(endpoint => {
      new EndpointBuilder(endpoint, this.provider.router).build(injector); // this.provider.middlewares.use
    });

    this.buildMiddlewares(injector, this.provider.middlewares.useAfter!);

    ctrl.dependencies.forEach((child: Type<any>) => {
      const provider = injector.getProvider(child) as ControllerProvider;

      /* istanbul ignore next */
      if (!provider) {
        throw new Error("Controller component not found in the ControllerRegistry");
      }

      const ctrlBuilder = new ControllerBuilder(provider, this.defaultRoutersOptions).build(injector);

      this.provider.router.use(provider.path, ctrlBuilder.provider.router);
    });

    return this;
  }

  private buildMiddlewares(injector: InjectorService, middlewares: any[]) {
    return middlewares
      .filter(o => typeof o === "function")
      .forEach((middleware: any) => this.provider.router.use(HandlerBuilder.from(middleware).build(injector)));
  }
}

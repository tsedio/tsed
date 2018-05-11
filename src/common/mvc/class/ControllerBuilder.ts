import {Type} from "@tsed/core";
import * as Express from "express";
import {IRouterOptions} from "../../config/interfaces/IRouterOptions";
import {ControllerRegistry} from "../registries/ControllerRegistry";
import {EndpointRegistry} from "../registries/EndpointRegistry";
import {ControllerProvider} from "./ControllerProvider";

import {EndpointBuilder} from "./EndpointBuilder";
import {HandlerBuilder} from "./HandlerBuilder";

export class ControllerBuilder {
  constructor(private provider: ControllerProvider, private defaultRoutersOptions: IRouterOptions = {}) {
    this.provider.router = Express.Router(Object.assign({}, defaultRoutersOptions, this.provider.routerOptions));
  }

  /**
   *
   * @returns {any}
   */
  build(): this {
    const ctrl = this.provider;

    EndpointRegistry.inherit(this.provider.useClass);

    this.buildMiddlewares(this.provider.middlewares.useBefore!);

    ctrl.endpoints.forEach(endpoint => {
      new EndpointBuilder(endpoint, this.provider.router).build(); // this.provider.middlewares.use
    });

    this.buildMiddlewares(this.provider.middlewares.useAfter!);

    ctrl.dependencies.forEach((child: Type<any>) => {
      const provider = ControllerRegistry.get(child) as ControllerProvider;

      /* istanbul ignore next */
      if (!provider) {
        throw new Error("Controller component not found in the ControllerRegistry");
      }

      const ctrlBuilder = new ControllerBuilder(provider, this.defaultRoutersOptions).build();

      this.provider.router.use(provider.path, ctrlBuilder.provider.router);
    });

    return this;
  }

  private buildMiddlewares(middlewares: any[]) {
    return middlewares
      .filter(o => typeof o === "function")
      .forEach((middleware: any) => this.provider.router.use(HandlerBuilder.from(middleware).build()));
  }
}

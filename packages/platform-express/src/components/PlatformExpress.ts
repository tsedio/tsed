import {IRoute, PlatformBuilder} from "@tsed/common";
import {Type} from "@tsed/core";
import {createHttpServer, createHttpsServer} from "../utils";

/**
 * @platform
 * @express
 */
export class PlatformExpress extends PlatformBuilder {
  static async bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}): Promise<PlatformExpress> {
    return this.build<PlatformExpress>(PlatformExpress).bootstrap(module, settings);
  }

  protected async loadRoutes(routes: IRoute[]): Promise<void> {
    await super.loadRoutes(routes);
  }

  protected createInjector(module: Type<any>, settings: any) {
    super.createInjector(module, settings);
    createHttpsServer(this.injector);
    createHttpServer(this.injector);
  }
}

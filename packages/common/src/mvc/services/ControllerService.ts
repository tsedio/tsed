import {Deprecated, ProxyMap, Type} from "@tsed/core";
import {Injectable, InjectorService, ProviderScope, ProviderType} from "@tsed/di";
import * as Express from "express";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {ExpressApplication} from "../../server/decorators/expressApplication"; // TODO should be located on server package
import {IComponentScanned} from "../../server/interfaces"; // TODO should be located on server package
import {ControllerBuilder} from "../class/ControllerBuilder";
import {ControllerProvider} from "../class/ControllerProvider";
import {ControllerRegistry} from "../registries/ControllerRegistry";
import {RouteService} from "./RouteService";

/**
 * @private
 */
@Injectable({
  scope: ProviderScope.SINGLETON,
  global: true
})
export class ControllerService extends ProxyMap<Type<any> | any, ControllerProvider> {
  /**
   *
   * @param expressApplication
   * @param injectorService
   * @param settings
   * @param routeService
   */
  constructor(
    private injectorService: InjectorService,
    @ExpressApplication private expressApplication: Express.Application,
    private settings: ServerSettingsService,
    private routeService: RouteService
  ) {
    super(injectorService as any, {filter: {type: ProviderType.CONTROLLER}});

    this.buildRouters();
  }

  get routes(): {route: string; provider: any}[] {
    return this.routeService.routes || [];
  }

  /**
   *
   * @param target
   * @returns {ControllerProvider}
   * @deprecated
   */
  @Deprecated("static ControllerService.get(). Removed feature.")
  static get(target: Type<any>): ControllerProvider | undefined {
    return ControllerRegistry.get(target) as ControllerProvider;
  }

  /**
   *
   * @param target
   * @deprecated
   */
  @Deprecated("static ControllerService.has(). Removed feature.")
  static has(target: Type<any>) {
    return ControllerRegistry.has(target);
  }

  /**
   *
   * @param target
   * @param provider
   * @deprecated
   */
  @Deprecated("static ControllerService.set(). Removed feature.")
  static set(target: Type<any>, provider: ControllerProvider) {
    ControllerRegistry.set(target, provider);

    return this;
  }

  /**
   *
   * @param components
   */
  public $onRoutesInit(components: {file: string; endpoint: string; classes: any[]}[]) {
    this.injectorService.logger.info("Map controllers");
    this.mapComponents(components);
  }

  /**
   * Invoke a controller from his Class.
   * @param target
   * @param locals
   * @param designParamTypes
   * @returns {T}
   * @deprecated
   */
  @Deprecated("ControllerService.invoke(). Removed feature. Use injectorService.invoke instead of.")
  public invoke<T>(target: any, locals: Map<Type<any> | any, any> = new Map<Type<any>, any>(), designParamTypes?: any[]): T {
    return this.injectorService.invoke<T>(target.provide || target, locals);
  }

  /**
   * Build routers and con
   */
  private buildRouters() {
    this.forEach((provider: ControllerProvider) => {
      if (!provider.hasParent()) {
        new ControllerBuilder(provider).build(this.injectorService);
      }
    });
  }

  /**
   *
   * @param components
   */
  private mapComponents(components: IComponentScanned[]) {
    components.forEach(component => {
      Object.keys(component.classes)
        .map(clazzName => component.classes[clazzName])
        .filter(clazz => component.endpoint && this.has(clazz))
        .map(clazz => this.get(clazz))
        .forEach((provider: ControllerProvider) => {
          if (!provider.hasParent()) {
            this.mountRouter(component.endpoint!, provider);
          }
        });
    });
  }

  /**
   *
   * @param {string} endpoint
   * @param {ControllerProvider} provider
   */
  private mountRouter(endpoint: string, provider: ControllerProvider) {
    const route = provider.getEndpointUrl(endpoint!);
    this.routeService.addRoute({provider, route});
    this.expressApplication.use(route, provider.router);
  }
}

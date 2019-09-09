import {Deprecated, ProxyMap, Type} from "@tsed/core";
import {Configuration, Injectable, InjectorService, ProviderScope, ProviderType} from "@tsed/di";
import {ControllerProvider} from "../models/ControllerProvider";
import {ControllerRegistry} from "../registries/ControllerRegistry";
import {IRouteController, RouteService} from "./RouteService";

/**
 * @private
 * @deprecated
 */
@Injectable({
  scope: ProviderScope.SINGLETON,
  global: true
})
export class ControllerService extends ProxyMap<Type<any> | any, ControllerProvider> {
  constructor(
    private injectorService: InjectorService,
    @Configuration() private settings: Configuration,
    private routeService: RouteService
  ) {
    super(injectorService as any, {filter: {type: ProviderType.CONTROLLER}});
  }

  /**
   * @deprecated
   */

  /* istanbul ignore next */
  get routes(): IRouteController[] {
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
}

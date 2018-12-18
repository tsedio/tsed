import {Deprecated, ProxyMap, Type} from "@tsed/core";
import {Provider, Service, ProviderType, ProviderRegistry, InjectorService} from "@tsed/di";
import {UnknowMiddlewareError} from "../errors/UnknowMiddlewareError";
import {IMiddleware} from "../interfaces";

/**
 * @deprecated This service will be removed in a future release. Use injectorService directly.
 */
@Service()
export class MiddlewareService extends ProxyMap<Type<any> | any, Provider<any>> {
  constructor(private injectorService: InjectorService) {
    super(injectorService, {filter: {type: ProviderType.MIDDLEWARE}});
  }

  /**
   *
   * @param target
   * @returns {Provider}
   * @deprecated
   */
  @Deprecated("static MiddlewareService.get(). Removed feature.")
  /* istanbul ignore next */
  static get(target: Type<any>): Provider<any> | undefined {
    return ProviderRegistry.get(target);
  }

  /**
   *
   * @param target
   * @param provider
   */
  @Deprecated("static MiddlewareService.set(). Removed feature.")
  /* istanbul ignore next */
  static set(target: Type<any>, provider: Provider<any>) {
    ProviderRegistry.set(target, provider);

    return this;
  }

  /**
   *
   * @param target
   * @deprecated
   */
  @Deprecated("static MiddlewareService.has(). Removed feature.")
  /* istanbul ignore next */
  static has(target: Type<any>): boolean {
    return ProviderRegistry.has(target);
  }

  /**
   *
   * @param target
   * @param locals
   * @param designParamTypes
   * @returns {T}
   */
  @Deprecated("MiddlewareService.invoke(). Removed feature. Use injectorService.invoke instead of.")
  /* istanbul ignore next */
  invoke<T extends IMiddleware>(target: Type<T>, locals: Map<Function, any> = new Map<Function, any>(), designParamTypes?: any[]): T {
    return this.injectorService.invoke<T>(target, locals, designParamTypes);
  }

  /**
   *
   * @param target
   * @param args
   * @returns {any}
   */
  @Deprecated("MiddlewareService.invokeMethod(). removed feature")
  /* istanbul ignore next */
  invokeMethod<T extends IMiddleware>(target: Type<T>, ...args: any[]) {
    const instance = this.injectorService.get<T>(target);

    if (!instance || !instance.use) {
      throw new UnknowMiddlewareError(target);
    }

    return instance.use(...args);
  }
}

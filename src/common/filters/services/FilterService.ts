import {Deprecated, ProxyMap, Type} from "@tsed/core";
import {Provider} from "../../di/class/Provider";
import {Service} from "../../di/decorators/service";
import {ProviderType} from "../../di/interfaces/ProviderType";
import {InjectorService} from "../../di/services/InjectorService";
import {UnknowFilterError} from "../errors/UnknowFilterError";
import {IFilter} from "../interfaces";
import {FilterRegistry} from "../registries/FilterRegistry";

/**
 * @deprecated This service will be removed in a future release. Use injectorService directly.
 */
@Service()
export class FilterService extends ProxyMap<Type<any> | any, Provider<any>> {
  constructor(private injectorService: InjectorService) {
    super(injectorService, {filter: {type: ProviderType.FILTER}});
  }

  /**
   *
   * @param target
   * @returns {ControllerProvider}
   */
  @Deprecated("static FilterService.get(). Removed feature.")
  /* istanbul ignore next */
  static get(target: Type<any>): Provider<any> | undefined {
    return FilterRegistry.get(target);
  }

  /**
   *
   * @deprecated
   * @param target
   * @param provider
   */
  @Deprecated("static FilterService.set(). Removed feature.")
  /* istanbul ignore next */
  static set(target: Type<any>, provider: Provider<any>) {
    FilterRegistry.set(target, provider);

    return this;
  }

  /**
   * @deprecated
   * @param target
   */
  @Deprecated("static FilterService.has(). Removed feature.")
  /* istanbul ignore next */
  static has(target: Type<any>): boolean {
    return FilterRegistry.has(target);
  }

  /**
   * @deprecated
   * @param target
   * @param locals
   * @param designParamTypes
   * @returns {T}
   */
  @Deprecated("FilterService.invoke(). Use injectorService.invoke instead of")
  /* istanbul ignore next */
  invoke<T extends IFilter>(target: Type<T>, locals: Map<Function, any> = new Map<Function, any>(), designParamTypes?: any[]): T {
    return this.injectorService.invoke<T>(target, locals, designParamTypes);
  }

  /**
   * @deprecated
   * @param target
   * @param args
   * @returns {any}
   */
  @Deprecated("FilterService.invoke(). Removed feature")
  invokeMethod<T extends IFilter>(target: Type<T>, ...args: any[]): any {
    const instance = this.injectorService.get<IFilter>(target);

    if (!instance || !instance.transform) {
      throw new UnknowFilterError(target);
    }

    const [expression, request, response] = args;

    return instance.transform(expression, request, response);
  }
}

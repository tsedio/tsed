import {Deprecated, ProxyRegistry, Type} from "@tsed/core";
import {Provider} from "../../di/class/Provider";
import {Service} from "../../di/decorators/service";
import {IProvider} from "../../di/interfaces/IProvider";
import {InjectorService} from "../../di/services/InjectorService";
import {UnknowFilterError} from "../errors/UnknowFilterError";
import {IFilter} from "../interfaces";
import {FilterRegistry} from "../registries/FilterRegistry";

@Service()
export class FilterService extends ProxyRegistry<Provider<any>, IProvider<any>> {
  constructor(private injectorService: InjectorService) {
    super(FilterRegistry);
  }

  /**
   *
   * @param target
   * @returns {ControllerProvider}
   */
  @Deprecated("Feature removed")
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
  @Deprecated("Feature removed")
  /* istanbul ignore next */
  static set(target: Type<any>, provider: Provider<any>) {
    FilterRegistry.set(target, provider);

    return this;
  }

  /**
   * @deprecated
   * @param target
   */
  @Deprecated("Feature removed")
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
  @Deprecated("Use injectorService.invoke instead of")
  /* istanbul ignore next */
  invoke<T extends IFilter>(target: Type<T>, locals: Map<Function, any> = new Map<Function, any>(), designParamTypes?: any[]): T {
    return this.injectorService.invoke<T>(target, locals, designParamTypes);
  }

  /**
   *
   * @param target
   * @param args
   * @returns {any}
   */
  invokeMethod<T extends IFilter>(target: Type<T>, ...args: any[]): any {
    const instance = this.injectorService.get(target);

    if (!instance || !instance.transform) {
      throw new UnknowFilterError(target);
    }

    const [expression, request, response] = args;

    return instance.transform(expression, request, response);
  }
}

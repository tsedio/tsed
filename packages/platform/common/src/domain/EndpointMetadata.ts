import {DecoratorTypes, deepMerge, descriptorOf, nameOf, prototypeOf, Store, Type} from "@tsed/core";
import {ParamMetadata} from "@tsed/platform-params";
import {JsonEntityComponent, JsonEntityStore, JsonMethodStore} from "@tsed/schema";

export interface EndpointViewOptions {
  path: string;
  options: any;
}

export interface EndpointRedirectOptions {
  status: number | undefined;
  url: string;
}

/**
 * EndpointMetadata contains metadata about a controller and his method.
 * Each annotation (@Get, @Body...) attached to a method are stored in a endpoint.
 * EndpointMetadata convert this metadata to an array which contain arguments to call an Express method.
 *
 * Example :
 *
 *    @Controller("/my-path")
 *    provide MyClass {
 *
 *        @Get("/")
 *        @Authenticated()
 *        public myMethod(){}
 *    }
 *
 */
@JsonEntityComponent(DecoratorTypes.METHOD)
export class EndpointMetadata extends JsonMethodStore {
  get targetName(): string {
    return nameOf(this.token);
  }

  get params(): ParamMetadata[] {
    return this.parameters as ParamMetadata[];
  }

  get view(): EndpointViewOptions {
    return this.store.get("view") as EndpointViewOptions;
  }

  set view(view: EndpointViewOptions) {
    this.store.set("view", view);
  }

  get acceptMimes(): string[] {
    return this.store.get<string[]>("acceptMimes", []);
  }

  set acceptMimes(mimes: string[]) {
    this.store.set("acceptMimes", mimes);
  }

  /**
   * Get an endpoint.
   * @param target
   * @param propertyKey
   * @param descriptor
   */
  static get(target: Type<any>, propertyKey: string | symbol, descriptor?: PropertyDescriptor): EndpointMetadata {
    descriptor = descriptor || descriptorOf(prototypeOf(target), propertyKey);

    return JsonEntityStore.from<EndpointMetadata>(prototypeOf(target), propertyKey, descriptor);
  }

  addOperationPath(method: string, path: string | RegExp, options: any = {}) {
    return this.operation.addOperationPath(method, path, options);
  }

  /**
   * Find the a value at the controller level. Let this value be extended or overridden by the endpoint itself.
   *
   * @param key
   * @returns {any}
   */
  get<T = any>(key: any): T {
    const ctrlValue = Store.from(this.target).get(key);

    return deepMerge<T>(ctrlValue, this.store.get(key));
  }
}

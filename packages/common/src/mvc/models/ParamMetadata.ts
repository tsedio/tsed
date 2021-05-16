import {ancestorsOf, DecoratorTypes, Enumerable, prototypeOf, Type} from "@tsed/core";
import {InjectorService, TokenProvider} from "@tsed/di";
import {JsonEntityComponent, JsonEntityStore, JsonEntityStoreOptions, JsonParameter} from "@tsed/schema";
import {ParamTypes} from "./ParamTypes";

export interface PipeMethods<T = any, R = any> {
  transform(value: T, metadata: ParamMetadata): R;
}

export type IPipe<T = any, R = any> = PipeMethods<T, R>;

export interface ParamConstructorOptions extends JsonEntityStoreOptions {
  expression?: string;
  useType?: Type<any>;
  paramType?: string | ParamTypes;
  pipes?: Type<PipeMethods>[];
}

@JsonEntityComponent(DecoratorTypes.PARAM)
export class ParamMetadata extends JsonEntityStore implements ParamConstructorOptions {
  /**
   *
   */
  @Enumerable()
  public expression: string;
  /**
   *
   */
  @Enumerable()
  public paramType: string | ParamTypes;

  @Enumerable()
  public pipes: Type<PipeMethods>[] = [];

  #cachedPipes: PipeMethods[];

  constructor(options: ParamConstructorOptions) {
    super(options);

    const {expression, paramType, pipes} = options;

    this.expression = expression || this.expression;
    this.paramType = paramType || this.paramType;
    this.pipes = pipes || [];
  }

  /**
   * Return the JsonOperation
   */
  get parameter(): JsonParameter {
    return this._parameter;
  }

  static get(target: Type<any>, propertyKey: string | symbol, index: number): ParamMetadata {
    return JsonEntityStore.from<ParamMetadata>(prototypeOf(target), propertyKey, index);
  }

  static getParams(target: Type<any>, propertyKey: string | symbol): ParamMetadata[] {
    const params: ParamMetadata[] = [];

    const klass = ancestorsOf(target)
      .reverse()
      .find((target) => JsonEntityStore.fromMethod(target, propertyKey).children.size);

    if (!klass) {
      return [];
    }

    JsonEntityStore.fromMethod(klass, propertyKey).children.forEach((param: ParamMetadata, index) => {
      params[+index] = param;
    });

    return params;
  }

  cachePipes(injector: InjectorService) {
    if (!this.#cachedPipes) {
      const get = (pipe: TokenProvider) => {
        return injector.getProvider(pipe)!.priority || 0;
      };
      const sort = (p1: TokenProvider, p2: TokenProvider) => (get(p1) < get(p2) ? -1 : get(p1) > get(p2) ? 1 : 0);
      const map = (token: TokenProvider) => injector.invoke<PipeMethods>(token)!;

      this.#cachedPipes = this.pipes.sort(sort).map(map).filter(Boolean);
    }
  }

  getPipes() {
    return this.#cachedPipes || [];
  }
}

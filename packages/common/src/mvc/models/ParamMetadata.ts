import {ancestorsOf, DecoratorTypes, Enumerable, prototypeOf, Type} from "@tsed/core";
import {JsonEntityComponent, JsonEntityStore, JsonEntityStoreOptions, JsonParameter} from "@tsed/schema";
import {ParamTypes} from "./ParamTypes";

export interface ParamConstructorOptions extends JsonEntityStoreOptions {
  expression?: string;
  useType?: Type<any>;
  paramType?: string | ParamTypes;
  pipes?: Type<IPipe>[];
}

export interface IPipe<T = any, R = any> {
  transform(value: T, metadata: ParamMetadata): R;
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
  public pipes: Type<IPipe>[] = [];

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
}

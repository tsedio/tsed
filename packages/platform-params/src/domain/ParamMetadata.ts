import {ancestorsOf, DecoratorTypes, prototypeOf, Type} from "@tsed/core";
import {JsonEntityComponent, JsonEntityStore, JsonEntityStoreOptions, JsonParameter} from "@tsed/schema";
import {ParamOptions} from "./ParamOptions";
import {ParamTypes} from "./ParamTypes";

export interface PipeMethods<T = any, R = any> {
  transform(value: T, metadata: ParamMetadata): R;
}

export type ParamConstructorOptions = JsonEntityStoreOptions & ParamOptions;

@JsonEntityComponent(DecoratorTypes.PARAM)
export class ParamMetadata extends JsonEntityStore implements ParamConstructorOptions {
  public expression: string;
  public paramType: string = "$ctx";
  public dataPath: string;
  public pipes: Type<PipeMethods>[] = [];

  constructor(options: ParamConstructorOptions) {
    super(options);

    const {paramType, pipes, dataPath} = options;

    this.expression = options.expression || this.expression;
    this.paramType = paramType || this.paramType;
    this.dataPath = dataPath || this.dataPath;
    this.pipes = pipes || [];
  }

  get key() {
    let {expression, paramType, dataPath} = this;

    if (expression && paramType === ParamTypes.HEADER) {
      expression = String(expression).toLowerCase();
    }

    return [dataPath, expression].filter(Boolean).join(".");
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

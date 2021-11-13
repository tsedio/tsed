import {DecoratorTypes, prototypeOf, Type} from "@tsed/core";
import {JsonEntityComponent, JsonEntityStore, JsonEntityStoreOptions, JsonParameterStore} from "@tsed/schema";
import {ParamOptions} from "./ParamOptions";
import {ParamTypes} from "./ParamTypes";

export interface PipeMethods<T = any, R = any> {
  transform(value: T, metadata: ParamMetadata): R;
}

export type ParamConstructorOptions = JsonEntityStoreOptions & ParamOptions;

@JsonEntityComponent(DecoratorTypes.PARAM)
export class ParamMetadata extends JsonParameterStore implements ParamConstructorOptions {
  public expression: string;
  public dataPath: string;
  public paramType: string = "$ctx";
  public pipes: Type<PipeMethods>[] = [];

  constructor(options: ParamConstructorOptions) {
    super(options);
    this.paramType = options.paramType || this.paramType;
    this.expression = options.expression || this.expression;
    this.dataPath = options.dataPath || this.dataPath;
    this.pipes = options.pipes || [];
  }

  get key() {
    let {expression, paramType, dataPath} = this;

    if (expression && paramType === ParamTypes.HEADER) {
      expression = String(expression).toLowerCase();
    }

    return [dataPath, expression].filter(Boolean).join(".");
  }

  static get(target: Type<any>, propertyKey: string | symbol, index: number): ParamMetadata {
    return JsonEntityStore.from<ParamMetadata>(prototypeOf(target), propertyKey, index);
  }
}

import {DecoratorTypes, Enumerable, prototypeOf, Type} from "@tsed/core";
import {JsonEntityComponent, JsonEntityStore, JsonEntityStoreOptions, JsonParameter} from "@tsed/schema";
import {IFilter} from "../interfaces/IFilter";
import {mapAllowedRequiredValues} from "../utils/mapAllowedRequiredValues";
import {ParamTypes} from "./ParamTypes";

export interface ParamConstructorOptions extends JsonEntityStoreOptions {
  /**
   * @deprecated
   */
  required?: boolean;
  expression?: string;
  useType?: Type<any>;
  /**
   * @deprecated use pipe instead
   */
  filter?: Type<IFilter>;
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
  pipes: Type<IPipe>[] = [];

  @Enumerable()
  filter?: Type<IFilter>;

  constructor(options: ParamConstructorOptions) {
    super(options);

    const {expression, paramType, filter, pipes} = options;

    this.expression = expression || this.expression;
    this.paramType = paramType || this.paramType;
    this.filter = filter;
    this.pipes = pipes || [];
  }

  /**
   * Return the JsonOperation
   */
  get parameter(): JsonParameter {
    return this._parameter;
  }

  get service(): string | Type<any> | ParamTypes {
    return this.filter || this.paramType;
  }

  set service(service: string | Type<any> | ParamTypes) {
    if (typeof service === "string") {
      this.paramType = service;
    } else {
      this.filter = service;
    }
  }

  get required(): boolean {
    return this.parameter.get("required");
  }

  set required(bool: boolean) {
    this.parameter.required(bool);
  }

  get allowedRequiredValues() {
    const schema = this.parameter.$schema;
    const type: string | string[] = schema.get("type") || "";

    return mapAllowedRequiredValues(type, schema.toJSON());
  }

  static get(target: Type<any>, propertyKey: string | symbol, index: number): ParamMetadata {
    return JsonEntityStore.from<ParamMetadata>(prototypeOf(target), propertyKey, index);
  }

  static getParams(target: Type<any>, propertyKey: string | symbol): ParamMetadata[] {
    const params: ParamMetadata[] = [];

    JsonEntityStore.fromMethod(target, propertyKey).children.forEach((param: ParamMetadata, index) => {
      params[+index] = param;
    });

    return params;
  }

  /**
   * Check precondition between value, required and allowedRequiredValues to know if the entity is required.
   * @param value
   * @returns {boolean}
   */
  isRequired(value: any): boolean {
    return this.required && [undefined, null, ""].includes(value) && !this.allowedRequiredValues.includes(value);
  }
}

import {Enumerable, Storable, Store, Type} from "@tsed/core";
import {IFilter} from "../interfaces/IFilter";
import {ParamTypes} from "./ParamTypes";

export interface IParamConstructorOptions {
  target?: Type<any>;
  propertyKey?: string | symbol;
  index: number;
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

export class ParamMetadata extends Storable implements IParamConstructorOptions {
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

  constructor(options: IParamConstructorOptions) {
    super(options.target as Type<any>, options.propertyKey!, options.index);

    const {expression, paramType, filter, pipes} = options;

    this.expression = expression || this.expression;
    this.paramType = paramType || this.paramType;
    this.filter = filter;
    this.pipes = pipes || [];
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

  static get(target: Type<any>, propertyKey: string | symbol, index: number): ParamMetadata {
    const params = this.getParams(target, propertyKey);

    if (!this.has(target, propertyKey, index)) {
      params[index] = new ParamMetadata({target, propertyKey, index});
      this.set(target, propertyKey, index, params[index]);
    }

    return params[index];
  }

  static has(target: Type<any>, propertyKey: string | symbol, index: number) {
    return !!this.getParams(target, propertyKey)[index];
  }

  static set(target: Type<any>, propertyKey: string | symbol, index: number, paramMetadata: ParamMetadata): void {
    const params = this.getParams(target, propertyKey);

    params[index] = paramMetadata;

    Store.fromMethod(target, String(propertyKey)).set("params", params);
  }

  static getParams(target: Type<any>, propertyKey: string | symbol): ParamMetadata[] {
    return Store.fromMethod(target, String(propertyKey)).get<ParamMetadata[]>("params") || [];
  }
}
